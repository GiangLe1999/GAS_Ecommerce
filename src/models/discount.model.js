"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    // "percentage" or "fixed_amount"
    discount_type: {
      type: String,
      default: "fixed_amount",
    },
    // Fixed amount: 10.000 or Percentage: 10%
    discount_value: {
      type: Number,
      required: true,
    },
    // Maximum value of discount
    discount_max_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    // Số lượng discount còn có thể sử dụng
    discount_left_count: {
      type: Number,
      required: true,
    },
    // Số lượng discount đã sử dụng
    discount_used_count: {
      type: Number,
      required: true,
    },
    // Discount được sử dụng bởi
    discount_used_by: {
      type: Array,
      default: [],
    },
    // Số lượng discount tối đa mà 1 user có thể sử dụng
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    },
    // Giá trị đơn hàng tối thiểu để có thể sử dụng discount
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    // Áp dụng cho toàn bộ SP hay SP cụ thể
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    // Nếu discount_applies_to = "specific", chỉ ra những SP được áp dụng
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
