"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

// Declare the Schema of the Mongo model
const orderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    /*
      order_checkout = {
          totalPrice,
          shippingFee,
          totalDiscount,
          totalCheckout,
      }
  */
    order_checkout: {
      type: Object, // Là checkout_order do service checkoutReview trả về
      default: {},
    },
    /*
      order_shipping = {
          street,
          city,
          state,
          country
      }
  */
    order_shipping: {
      type: Object,
      default: {},
    },
    // Kiểu thanh toán: COD, PayPal
    order_payment: {
      type: Object,
      default: {},
    },
    // Là new_shop_order_ids do service checkoutReview trả về
    order_products: { type: Array, required: true },
    // Số tracking đơn hàng để giám sát tình trạng vận chuyển
    order_trackingNumber: {
      type: String,
      default: "#0000118052022",
    },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      // Pending: Đơn hàng được tạo nhưng chưa được xử lý
      // Confirmed: Đơn hàng đã được xử lý và xác nhận bởi người bán
      // Shipped: Đơn hàng đang được vận chuyển đến tay người dùng
      // Delivered: Đơn hàng đã được vận chuyển tới tay người dùng
      // Canceled: Đơn hàng bị hủy bởi khách hàng hoặc người bán
      default: "pending",
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);
