"use strict";

const {
  product,
  electronics,
  clothing,
  furniture,
} = require("../product.model");

// Query
const getProducts = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const searchProducts = async ({ keyword }) => {
  const searchRegex = new RegExp(keyword);
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: searchRegex },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

const getAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();

  return products;
};

const getProduct = async ({ product_id, unSelect = [] }) => {
  return await product.findById(product_id).select(unSelect).lean();
};

// Update
const publishProduct = async ({ product_shop, product_id }) => {
  const { modifiedCount } = await product.updateOne(
    {
      product_shop,
      _id: product_id,
    },
    { $set: { isDraft: false, isPublished: true } }
  );

  return modifiedCount;
};

const unPublishProduct = async ({ product_shop, product_id }) => {
  const { modifiedCount } = await product.updateOne(
    {
      product_shop,
      _id: product_id,
    },
    { $set: { isDraft: true, isPublished: false } }
  );

  return modifiedCount;
};

// Model có thể là Product, clothing hoặc electronics, ...
const updateProductById = async ({ product_id, payload, model, isNew }) => {
  return await model.findByIdAndUpdate(product_id, payload, { new: isNew });
};

// Check nhiều Product có tồn tại trong database hay không
const checkProductsAreValid = async (products) => {
  // Dùng promise.all để có thể chạy nhiều tác vụ bất đồng bộ tại cùng 1 thời điểm
  return await Promise.all(
    // map method return 1 mảng các promise
    products.map(async (product) => {
      const existingProduct = await getProduct({
        product_id: product.productId,
      });

      if (existingProduct) {
        // Return promise
        return {
          price: existingProduct.product_price,
          quantity: product.quantity,
          productId: existingProduct._id,
        };
      }
    })
  );
};

module.exports = {
  getProducts,
  getAllProducts,
  getProduct,
  searchProducts,
  publishProduct,
  unPublishProduct,
  updateProductById,
  checkProductsAreValid,
};
