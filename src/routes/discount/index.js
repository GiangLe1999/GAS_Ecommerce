"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { checkAuthentication } = require("../../middlewares/checkAuth");
const router = express.Router();

// Get amount of discount
router.post("/amount", asyncHandler(discountController.getDiscountAmount));

//  Get all products with discount code
router.get(
  "/discount_with_products",
  asyncHandler(discountController.getAllProductsWithDiscountCode)
);

router.use(checkAuthentication);

// Create discount code
router.post("", asyncHandler(discountController.createDiscountCode));

// Get all discount codes by shop
router.get("", asyncHandler(discountController.getAllDiscountCodesByShop));

module.exports = router;
