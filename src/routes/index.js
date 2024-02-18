"use strict";

const express = require("express");
const { checkApiKey, checkPermission } = require("../middlewares/checkAuth");
const router = express.Router();

// Check Api Key
router.use(checkApiKey);
//  Check Permission
router.use(checkPermission("0000"));

router.use("/v1/api/product", require("./product"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api", require("./access"));

module.exports = router;
