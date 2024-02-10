"use strict";
const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // Tạo accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    // Tạo refreshToken
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`Verify Error`, err);
      } else {
        console.log(`Decoded Verify`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { createTokenPair };
