"use strict";

const { CREATED, OK } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new CREATED({
      message: "Create discount code successfully!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodesByShop = async (req, res, next) => {
    new OK({
      message: "Get all discount codes by shop successfully!",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllProductsWithDiscountCode = async (req, res, next) => {
    new OK({
      message: "Get all products with discount code successfully!",
      metadata: await DiscountService.getAllProductsWithDiscountCode({
        ...req.query,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new OK({
      message: "Get discount amount successfully!",
      metadata: await DiscountService.getDiscountAmount(req.body),
    }).send(res);
  };

  deleteDiscountCode = async (req, res, next) => {};
}

module.exports = new DiscountController();
