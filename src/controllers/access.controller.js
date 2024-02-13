"use strict";

const { CREATED, OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  refreshTokenHandler = async (req, res, next) => {
    console.log(req);
    new OK({
      message: "Get new token successfully!",
      metadata: await AccessService.refreshTokenHandler(req.body.refreshToken),
    }).send(res);
  };

  login = async (req, res, next) => {
    new OK({
      message: "Logged in successfully!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new OK({
      message: "Logged out successfully!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered successfully!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
