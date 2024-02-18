"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { createTokenPair } = require("../utils/authUtils");
const KeyTokenService = require("./keyToken.service");
const { getDataByFields } = require("../utils");
const {
  BadRequestError,
  ForbiddenRequestError,
  UnauthorizedRequestError,
} = require("../core/error.response");
const ShopService = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  // Khi access token hết hạn, người dùng sẽ sử dụng refreshToken để lấy lại cặp AT, RT mới
  // thông qua hàm refreshTokenHandler

  static refreshTokenHandler = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    // 1 - Check refreshToken đã được sử dụng trước đó hay chưa?
    // 2 - Nếu refreshToken đã được sử dụng trước đó rồi thì xóa keyToken
    if (keyStore.usedRefreshTokens.includes(refreshToken)) {
      await KeyTokenService.removeKeyTokenByUserId(userId);
      throw new ForbiddenRequestError(
        "Error: Something went wrong. Please login again!"
      );
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new UnauthorizedRequestError("Error: Shop has not been registered");

    const existingShop = await ShopService.findShopByEmail({ email });
    if (!existingShop) {
      throw new UnauthorizedRequestError("Error: Shop has not been registered");
    }

    // 3 - Nếu refreshToken chưa từng được sử dụng trước đây
    // Cấp Token mới, lưu token mới vào DB và đưa refreshToken cũ vào ds token đã sử dụng
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
        accessToken: tokens.accessToken,
      },
      // Add vào mảng
      $addToSet: {
        usedRefreshTokens: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  // 1 - Check email
  // 2 - Match password
  // 3 - Tạo privateKey, publicKey và lưu vào Database
  // 4 - Tạo accessToken, refreshToken
  // 5 - Return data cùng accessToken, refreshToken
  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const existingShop = await ShopService.findShopByEmail({ email });

    if (!existingShop) {
      throw new ForbiddenRequestError("Error: Shop has not been registered");
    }

    // 2
    const matchPassword = bcrypt.compare(password, existingShop.password);
    if (!matchPassword) {
      throw new BadRequestError("Error: Password does not match");
    }

    // 3
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // 4
    const { _id: userId } = existingShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getDataByFields({
        fields: ["_id", "name", "email"],
        object: existingShop,
      }),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const deletedKeyStore = await KeyTokenService.removeKeyTokenById(
      keyStore._id
    );

    return deletedKeyStore;
  };

  static signUp = async ({ name, email, password }) => {
    const existingShop = await shopModel.findOne({ email }).lean();

    if (existingShop) {
      throw new BadRequestError("Error: Shop already registered");
    }

    // Thuật toán băm tốn nhiều CPU nên saltOrRounds chỉ cần bằng 10
    const hashedPassword = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // Create privateKey, publicKey
      // Hàm generateKeyPairSync sẽ trả về privateKey và publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     // pkcs1 là public key crytography standard 1
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");

      // Sau khi tạo key, lưu vào Keytoken collection
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new ForbiddenRequestError("Error: keyStore error");
      }

      // Nếu lưu publicKey thành công, tạo 1 cặp Token để đẩy về cho user
      const tokens = await createTokenPair(
        { userId: newShop._id },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getDataByFields({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return { code: 200, metadata: null };
  };
}

module.exports = AccessService;
