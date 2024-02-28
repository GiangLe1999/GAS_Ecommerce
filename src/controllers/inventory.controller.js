"use strict";

const InventoryService = require("../services/inventory.service");
const { OK, CREATED } = require("../core/success.response.js");

class InventoryController {
  // Add cart item V1
  addStockToInventory = async (req, res, next) => {
    new OK({
      message: "Update inventory successfully!",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
