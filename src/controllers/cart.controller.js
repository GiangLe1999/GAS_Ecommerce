"use strict";

const CartService = require("../services/cart.service");
const { OK, CREATED } = require("../core/success.response.js");

class CartController {
  // Add cart item V1
  addToCart = async (req, res, next) => {
    new OK({
      message: "Add item to cart successfully!",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  // Add cart item V2
  updateCart = async (req, res, next) => {
    new OK({
      message: "Update cart successfully!",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  removeItemFromCart = async (req, res, next) => {
    new OK({
      message: "Remove cart successfully!",
      metadata: await CartService.removeItemFromCart(req.body),
    }).send(res);
  };

  getCart = async (req, res, next) => {
    new OK({
      message: "Get cart item list successfully!",
      metadata: await CartService.getCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
