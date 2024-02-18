"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

// Declare the Schema of the Mongo model
const cartSchema = new Schema(
  {
    cart_status: {
      type: String,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    /*
    cart_products: [{
      productId,
      shopId,
      quantity,
      name,
      price
     }],

     Cần truyền thêm cả name và price để xác minh dữ liệu đặt hàng khớp với dữ liệu database
     - Do người dùng có thể gian dối
     - Dữ liệu dưới database đã thay đổi nhưng trên frontend chưa cập nhật
  */
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_product_count: {
      type: Number,
      default: 0,
    },
    cart_userId: {
      type: Number,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);
