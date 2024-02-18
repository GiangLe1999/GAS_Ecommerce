const { model, Schema } = require("mongoose"); // Erase if already required
const slugify = require("slugify");

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
    product_description: String,
    product_slug: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    // Mixed là hỗn hợp, chấp nhận mọi type
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratings: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      // Làm tròn 4.34236 => 4.3
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    // Vì isDraft cần được sử dụng nhiều nên ta đánh index cho nó luôn
    // select: false để mặc định không lấy ra trường isDraft khi query
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  { collection: COLLECTION_NAME, timestamps: true }
);

// Create index for search
productSchema.index({ product_name: "text", product_description: "text" });

// Document middleware: Được chạy trước khi thực thi .save() và .create()
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// Define schema of product has type = Clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { collection: "clothes", timestamps: true }
);

// Define schema of product has type = Electronics
const electronicsSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { collection: "electronics", timestamps: true }
);

// Define schema of product has type = Furniture
const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { collection: "furnitures", timestamps: true }
);

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothes", clothingSchema),
  electronics: model("Electronics", electronicsSchema),
  furniture: model("Furniture", furnitureSchema),
};
