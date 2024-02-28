const inventoryModel = require("../../models/inventory.model");
const { convertToMongoDBObjectId } = require("../../utils");

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

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    invent_productId: convertToMongoDBObjectId(productId),
    invent_stock: { $gte: quantity },
  };
  const updateSet = {
    $inc: {
      invent_stock: -quantity,
    },
    $push: {
      invent_reservations: { quantity, cartId, createdOn: new Date() },
    },
  };
  const options = { upsert: true, new: true };
  return await inventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
