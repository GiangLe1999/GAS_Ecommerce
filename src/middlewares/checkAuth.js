"use strict";

const ApiKeyService = require("../services/apiKey.service");

const HEADER = { API_KEY: "x-api-key", AUTHORIZATION: "authorization" };

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

    console.log("permissions::", req.objKey.permissions);

    const validPermissions = req.objKey.permissions.includes(permission);
    if (!validPermissions) {
      return res.status(403).json({ message: "Permission Denied" });
    }

    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = { checkApiKey, checkPermission, asyncHandler };
