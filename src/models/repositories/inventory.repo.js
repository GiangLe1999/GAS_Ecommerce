const inventoryModel = require("../../models/inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventoryModel.create({
    invent_productId: productId,
    invent_location: location,
    invent_stock: stock,
    invent_shopId: shopId,
  });
};

module.exports = {
  insertInventory,
};
