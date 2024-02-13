"use strict";

const express = require("express");
const { checkApiKey, checkPermission } = require("../middlewares/checkAuth");
const router = express.Router();

// Check Api Key
// router.use(checkApiKey);
//  Check Permission
// router.use(checkPermission("0000"));

router.use("/v1/api", require("./access"));

module.exports = router;
