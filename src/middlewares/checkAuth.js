"use strict";

const {
  UnauthorizedRequestError,
  NotFoundRequestError,
} = require("../core/error.response");
const asyncHandler = require("../helpers/asyncHandler");
const ApiKeyService = require("../services/apiKey.service");
const KeyTokenService = require("../services/keyToken.service");
const JWT = require("jsonwebtoken");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-rtoken-id",
};

const checkApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({ message: "Forbidden Error" });
    }

    // Check Api Key
    const objKey = await ApiKeyService.findApiKey(key);
    if (!objKey) {
      return res.status(403).json({ message: "Forbidden Error" });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
  }
};

// Check Permission trả về 1 hàm Closure và hàm Closure này có thể tận dụng các biến của hàm cha
// Biến cần tận dụng từ hàm cha ở đây là biến permission
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: "Permission Denied" });
    }

    const validPermissions = req.objKey.permissions.includes(permission);
    if (!validPermissions) {
      return res.status(403).json({ message: "Permission Denied" });
    }

    return next();
  };
};

const checkAuthentication = asyncHandler(async (req, res, next) => {
  // 1 - Check userId missing?
  // 2 - Get accessToken
  // 3 - Verify token
  // 4 - Check user in DB
  // 5 - Check keyStore with userId
  // 6 - Return next()

  // 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new UnauthorizedRequestError("Error: Invalid request");

  // 2
  const keyStore = await KeyTokenService.findKeyTokenByUserId(userId);
  if (!keyStore) throw new NotFoundRequestError("Error: Not found keyStore");

  // 3
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodedUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodedUser.userId)
        throw new UnauthorizedRequestError("Error: Invalid userId");

      req.keyStore = keyStore;
      req.user = decodedUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken)
    throw new UnauthorizedRequestError("Error: Invalid request");

  // 4
  try {
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
    if (keyStore.user.toString() !== decodedUser.userId)
      throw new UnauthorizedRequestError("Error: Invalid userId");

    req.keyStore = keyStore;
    req.user = decodedUser;

    // 5
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = { checkApiKey, checkPermission, checkAuthentication };
