"use strict";

const {
  product,
  clothing,
  electronics,
  furniture,
} = require("../models/product.model.js");
const { BadRequestError } = require("../core/error.response.js");
const {
  unPublishProduct,
  publishProduct,
  getProducts,
  getProduct,
  searchProducts,
  getAllProducts,
  updateProductById,
} = require("../models/repositories/product.repo.js");
const {
  removeUndefinedProperty,
  updateNestedObject,
} = require("../utils/index.js");
const { insertInventory } = require("../models/repositories/inventory.repo.js");

// Define factory class to create product
class ProductFactory {
  static productRegistry = {}; // key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Error: Invalid product type: ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, product_id, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Error: Invalid product type: ${type}`);

    return new productClass(payload).updateProduct(product_id);
  }

  static listProductTypes() {
    return Object.keys(ProductFactory.productRegistry);
  }

  // Query
  static async getAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await getProducts({ query, limit, skip });
  }

  static async getAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await getProducts({ query, limit, skip });
  }

  static async searchProducts({ keyword }) {
    return await searchProducts({ keyword });
  }

  static async getAllProducts(
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true }
  ) {
    return await getAllProducts({
      limit,
      sort,
      page,
      filter,
      select: [
        "product_name",
        "product_thumb",
        "product_price",
        "product_shop",
      ],
    });
  }

  static async getProduct({ product_id }) {
    return await getProduct({ product_id, unSelect: ["-__v"] });
  }

  // Update
  static async publishProduct({ product_shop, product_id }) {
    return await publishProduct({ product_shop, product_id });
  }

  static async unPublishProduct({ product_shop, product_id }) {
    return await unPublishProduct({ product_shop, product_id });
  }
}

// Define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
  }

  // Create new product
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      // Add product stock
      await insertInventory({
        productId: product_id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }

    return newProduct;
  }

  // Update product
  async updateProduct(product_id, payload, isNew = true) {
    return await updateProductById({
      product_id,
      payload,
      model: product,
      isNew,
    });
  }
}

// Define sub-class (type = Clothing)
class Clothing extends Product {
  // Ghi đè lên method createProduct của Class Product
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing)
      throw new BadRequestError("Error: Create new clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct)
      throw new BadRequestError("Error: Create new product error");

    return newProduct;
  }

  async updateProduct(product_id) {
    // 1 - Remove những property có giá trị bằng null hoặc undefine do FE gửi về
    const objectParams = removeUndefinedProperty(this);
    // 2 - Update tại Clothing document nếu có product_attributes bên trong payload
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        payload: updateNestedObject(objectParams.product_attributes),
        model: clothing,
      });
    }

    // 3 - Update tại Product document
    const updatedProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams)
    );
    return updatedProduct;
  }
}

// Define sub-class (type = Electronics)
class Electronics extends Product {
  // Ghi đè lên method createProduct của Class Product
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronics)
      throw new BadRequestError("Error: Create new clothing error");

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct)
      throw new BadRequestError("Error: Create new product error");

    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = removeUndefinedProperty(this);

    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        payload: updateNestedObject(objectParams.product_attributes),
        model: electronics,
      });
    }

    const updatedProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams)
    );

    return updatedProduct;
  }
}

// Define sub-class (type = Electronics)
class Furniture extends Product {
  // Ghi đè lên method createProduct của Class Product
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture)
      throw new BadRequestError("Error: Create new furniture error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct)
      throw new BadRequestError("Error: Create new product error");

    return newProduct;
  }
}

// Register product_type
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
