const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: {
      type: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    // Mixed là hỗn hợp, chấp nhận mọi type
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  { collection: COLLECTION_NAME, timestamps: true }
);

// Define schema of product has type = Clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
  },
  { collection: "clothes", timestamps: true }
);

// Define schema of product has type = Electronics
const electronicsSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
  },
  { collection: "electronics", timestamps: true }
);

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothes", clothingSchema),
  clothing: model("Electronics", electronicsSchema),
};
