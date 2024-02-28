"use strict";

const express = require("express");
const inventoryController = require("../../controllers/inventory.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();
const { checkAuthentication } = require("../../middlewares/checkAuth");

router.use(checkAuthentication);
router.post("", asyncHandler(inventoryController.addStockToInventory));

module.exports = router;
