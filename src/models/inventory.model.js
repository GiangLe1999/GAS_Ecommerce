const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECION_NAME = "Inventories";

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
  {
    invent_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    invent_location: {
      type: String,
      default: "unknown",
    },
    invent_stock: {
      type: Number,
      required: true,
    },
    invent_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    // Reservations là đơn hàng đặt trước. Đặt hàng trước có nghĩa là phải trừ đi hàng tồn kho.
    // Khi product được user thêm vào giỏ hàng thì ta sẽ lưu dữ liệu đặt hàng vào mảng invent_reservations.
    // Việc lưu trữ reservations này sẽ giúp ta ngăn ngừa lỗi hàng tồn kho
    // Format: {cartId, stock: 1, createdOn}
    invent_reservations: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, collection: COLLECION_NAME }
);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
