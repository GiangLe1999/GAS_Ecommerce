"use strict";

const ProductService = require("../services/product.service");
const { OK, CREATED } = require("../core/success.response.js");
const ProductFactory = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new CREATED({
      message: "Create new product successfully!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new OK({
      message: "Get draft list for shop successfully!",
      metadata: await ProductFactory.getAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all published for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllPublishedForShop = async (req, res, next) => {
    new OK({
      message: "Get published list for shop successfully!",
      metadata: await ProductFactory.getAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get search results
   * @param {String} keyword
   * @return {JSON}
   */
  getSearchProducts = async (req, res, next) => {
    new OK({
      message: "Get search results successfully!",
      metadata: await ProductFactory.searchProducts(req.params),
    }).send(res);
  };

  /**
   * @desc Get all products
   * @return {JSON}
   */
  getAllProducts = async (req, res, next) => {
    new OK({
      message: "Get all products successfully!",
      metadata: await ProductFactory.getAllProducts(),
    }).send(res);
  };

  /**
   * @desc Get product
   * @param {String} product_id
   * @return {JSON}
   */
  getProduct = async (req, res, next) => {
    new OK({
      message: "Get product detail successfully!",
      metadata: await ProductFactory.getProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  /**
   * @desc Publish product
   * @param {String} id
   * @return {JSON}
   */
  publishProduct = async (req, res, next) => {
    new OK({
      message: "Published product successfully!",
      metadata: await ProductFactory.publishProduct({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  /**
   * @desc Unpublish product
   * @param {String} id
   * @return {JSON}
   */
  unPublishProduct = async (req, res, next) => {
    new OK({
      message: "Unpublished product successfully!",
      metadata: await ProductFactory.unPublishProduct({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  /**
   * @desc Update product
   * @param {String} id
   * @return {JSON}
   */
  updateProduct = async (req, res, next) => {
    new OK({
      message: "Updated product successfully!",
      metadata: await ProductFactory.updateProduct(
        req.body.product_type,
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
