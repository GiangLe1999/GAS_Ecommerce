"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.removeItemFromCart));
router.patch("/update", asyncHandler(cartController.updateCart));
router.get("", asyncHandler(cartController.getCart));

module.exports = router;
