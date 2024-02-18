const cartModel = require("../cart.model");

const createCart = async ({ userId, product }) => {
  return await cartModel.create({
    cart_userId: userId,
    cart_products: [product],
  });
};

const updateCartItemQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
    cart_userId: userId,
    "cart_products.productId": productId,
    cart_status: "active",
  };

  const updateSet = {
    $inc: {
      "cart_products.$.quantity": quantity,
    },
  };

  const options = { upsert: true, new: true };

  return await cartModel.findOneAndUpdate(query, updateSet, options);
};

module.exports = {
  createCart,
  updateCartItemQuantity,
};
