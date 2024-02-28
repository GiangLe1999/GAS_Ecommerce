"use strict";

const express = require("express");
const { checkApiKey, checkPermission } = require("../middlewares/checkAuth");
const { pushLogToDiscord } = require("../middlewares");
const router = express.Router();

// Add log to discord
router.use(pushLogToDiscord);

// Check Api Key
router.use(checkApiKey);
//  Check Permission
router.use(checkPermission("0000"));

router.use("/v1/api/product", require("./product"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api", require("./access"));

module.exports = router;
