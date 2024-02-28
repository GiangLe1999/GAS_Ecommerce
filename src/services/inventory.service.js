"use strict";

const { NotFoundRequestError } = require("../core/error.response");
const {} = require("../models/inventory.model");
const { getProduct } = require("../models/repositories/product.repo");

class InventoryService {
  // Sử dụng khi nhập lô hàng mới vào kho
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "Dak Lak",
  }) {
    const product = await getProduct(productId);

    if (!product) {
      throw new NotFoundRequestError("Product does not exist");
    }

    const query = { invent_shopId: shopId, invent_productId: productId };
    const updateSet = {
      $inc: {
        invent_stock: stock,
      },
      $set: {
        invent_location: location,
      },
    };
    const options = { upsert: true, new: true };

    // Update inventory
    return await inventoryModel.updateOne(query, updateSet, options);
  }
}

module.exports = InventoryService;
