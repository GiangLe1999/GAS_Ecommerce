"use strict";

const discountModel = require("../models/discount.model");
const {
  getDiscountCodeByCode,
  getAllSelectedDiscountCodes,
} = require("../models/repositories/discount.repo");
const { getAllProducts } = require("../models/repositories/product.repo");
const { convertToMongoDBObjectId } = require("../utils");

const {
  BadRequestError,
  NotFoundRequestError,
} = require("../core/error.response.js");

/*
  Discount services:
  1 - Generate discount code [Shop | Admin]
  2 - Get all products by discount codes [User]
  3 - Get all discount codes by shop [User | Shop]
  4 - Get discount amount [User]
  5 - Delete discount code [Admin | Shop]
  6 - Cancel discount code [User]
*/

class DiscountService {
  // 1 - Create discount code
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      shopId,
      min_order_value,
      value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      max_value,
      left_count,
      used_count,
      used_by,
      max_uses_per_user,
      is_active,
    } = payload;

    // Check payload
    if (new Date() > new Date(start_date) || new Date() > new Date(end_date))
      throw new BadRequestError("Error: Discount has been expired!");

    if (new Date(end_date) <= new Date(start_date)) {
      throw new BadRequestError("Error: Start date or end date is not valid!");
    }

    // Create index for discount code
    const existingDiscountCode = await getDiscountCodeByCode({ code, shopId });

    // Nếu discount đã tồn tại và đang hoạt động thì bắn lỗi
    if (existingDiscountCode && existingDiscountCode.active === true)
      throw new BadRequestError("Error: Discount code already exists!");

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_left_count: left_count,
      discount_used_count: used_count,
      discount_used_by: used_by,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "specific" ? product_ids : [],
    });

    return newDiscount;
  }

  // 2 - Get all products by discount codes
  static async getAllProductsWithDiscountCode({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const existingDiscountCode = await getDiscountCodeByCode({ code, shopId });
    if (!existingDiscountCode || !existingDiscountCode.discount_is_active)
      throw new NotFoundRequestError("Error: Discount code does not exist!");

    const { discount_applies_to, discount_product_ids } = existingDiscountCode;

    let products;
    if (discount_applies_to === "all") {
      //  Get all products
      products = await getAllProducts({
        filter: {
          product_shop: convertToMongoDBObjectId(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      // Get specific product ids
      products = await getAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  // 3 - Get all discount codes by shop
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discountCodes = await getAllSelectedDiscountCodes({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToMongoDBObjectId(shopId),
        discount_is_active: true,
      },
      select: ["discount_code", "discount_name"],
      model: discountModel,
    });

    return discountCodes;
  }

  // 4 - Get discount amount
  static async getDiscountAmount({ code, shopId, userId, products }) {
    const existingDiscountCode = await getDiscountCodeByCode({ code, shopId });
    if (!existingDiscountCode)
      throw new NotFoundRequestError("Error: Discount code does not exist!");

    const {
      discount_is_active,
      discount_left_count,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_used_by,
      discount_type,
      discount_value,
      discount_max_value,
    } = existingDiscountCode;
    if (!discount_is_active)
      throw new NotFoundRequestError("Error: Discount code expired!");

    if (discount_left_count <= 0)
      throw new BadRequestError("Error: Discount code was out!");

    if (
      new Date() > new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    )
      throw new BadRequestError("Error: Discount has been expired!");

    if (new Date(discount_end_date) <= new Date(discount_start_date)) {
      throw new BadRequestError("Error: Start date or end date is not valid!");
    }

    let totalOrderValue = 0;
    if (discount_min_order_value > 0) {
      totalOrderValue = products.reduce((acc, cur) => {
        return acc + cur.quantity * cur.price;
      }, 0);

      if (totalOrderValue < discount_min_order_value)
        throw new BadRequestError(
          `Error: Minimum order value is not reached! Discount code requires minimum value of ${discount_min_order_value}`
        );
    }

    const usedByUser = discount_used_by.filter(
      (user) => user.userId === userId
    );
    if (usedByUser.length >= discount_max_uses_per_user)
      throw new BadRequestError(
        "Error: Maximum number of uses per user has been reached!"
      );

    let discountAmount =
      discount_type === "fixed amount"
        ? discount_value
        : totalOrderValue * (discount_value / 100);

    if (discountAmount > discount_max_value) {
      discountAmount = discount_max_value;
    }

    return {
      totalOrderValue,
      discountAmount,
      totalPrice: totalOrderValue - discountAmount,
    };
  }

  // 5 - Delete discount code
  static async deleteDiscountCode({ shopId, code }) {
    const deletedDiscountCode = await discountModel.findOneAndDelete({
      discount_code: code,
      discount_shopId: convertToMongoDBObjectId(shopId),
    });

    return deletedDiscountCode;
  }

  // 6 - Cancel discount code (By user)
  static async cancelDiscountCode({ shopId, code, userId }) {
    const existingDiscountCode = await getDiscountCodeByCode({
      discount_code: code,
      discount_shopId: convertToMongoDBObjectId(shopId),
    });

    if (!existingDiscountCode)
      throw new NotFoundRequestError("Error: Discount code does not exist!");

    const result = await discountModel.findByIdAndUpdate(
      existingDiscountCode._id,
      {
        // Đưa userId ra khỏi mảng discount_used_by
        $pull: {
          discount_used_by: userId,
        },
        // Tăng 1 / Giảm 1 đối với discount_left_count / discount_used_count
        $inc: {
          discount_left_count: 1,
          discount_used_count: -1,
        },
      }
    );

    return result;
  }
}

module.exports = DiscountService;
