"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { checkAuthentication } = require("../../middlewares/checkAuth");
const router = express.Router();
const ProductController = require("../../controllers/product.controller");

// Search products
router.get(
  "/search/:keyword",
  asyncHandler(ProductController.getSearchProducts)
);
// Get all products
router.get("", asyncHandler(ProductController.getAllProducts));
// Get all products
router.get("/:product_id", asyncHandler(ProductController.getProduct));

// Authentication
router.use(checkAuthentication);

// Create product
router.post("", asyncHandler(ProductController.createProduct));
// Publish product
router.patch("/publish/:id", asyncHandler(ProductController.publishProduct));
// Unpublish product
router.patch(
  "/unpublish/:id",
  asyncHandler(ProductController.unPublishProduct)
);
// Update product
router.patch("/:product_id", asyncHandler(ProductController.updateProduct));

// Get all drafts of shop
router.get("/drafts/all", asyncHandler(ProductController.getAllDraftsForShop));
// Get all published of shop
router.get(
  "/published/all",
  asyncHandler(ProductController.getAllPublishedForShop)
);

module.exports = router;
