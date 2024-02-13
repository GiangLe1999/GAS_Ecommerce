"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens : null;

      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        usedRefreshTokens: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findKeyTokenByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyTokenById = async (_id) => {
    return await keytokenModel.deleteOne({
      _id,
    });
  };

  static removeKeyTokenByUserId = async (userId) => {
    return await keytokenModel.deleteOne({
      user: userId,
    });
  };

  static findKeyTokenByUsedRefreshToken = async (refreshToken) => {
    return await keytokenModel
      .findOne({ usedRefreshTokens: refreshToken })
      .lean();
  };

  static findKeyTokenByCurrentRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };
}

module.exports = KeyTokenService;
