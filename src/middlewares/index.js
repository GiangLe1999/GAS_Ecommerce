"use strict";

const Logger = require("../loggers/discord.log.v2");

const pushLogToDiscord = (req, res, next) => {
  try {
    Logger.sendFormatCode({
      title: `Method: ${req.method}`,
      code: req.method === "GET" ? req.query : req.body,
      message: `${req.get("host")}${req.originalUrl}`,
    });
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = { pushLogToDiscord };
