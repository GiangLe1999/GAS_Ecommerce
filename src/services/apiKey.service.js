"use strict";

const apiKeyModel = require("../models/apikey.model");
const crypto = require("crypto");

class ApiKeyService {
  static findApiKey = async (key) => {
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    return objKey;
  };
}

module.exports = ApiKeyService;
