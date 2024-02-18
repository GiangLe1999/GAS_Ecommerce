"use strict";

const cartModel = require("../models/cart.model");
const {
  createCart,
  updateCartItemQuantity,
} = require("../models/repositories/cart.repo");
const { getProduct } = require("../models/repositories/product.repo");
const { NotFoundRequestError } = require("../core/error.response");

/* 
  1 - Add to cart (khi click vào nút Thêm vào giỏ hàng)
  2 - Update cart (Add to cart v2 – Click vào nút + hoặc – bên trong giỏ hàng)
  3 - Remove item from cart
  4 - Get cart
*/

class CartService {
  // Add product to cart
  // TH1: Click vào nút Thêm vào giỏ hàng tại trang Product
  static async addToCart({ userId, product = {} }) {
    const existingUserCart = await cartModel.findOne({
      cart_userId: userId,
    });

    // Nếu user chưa có cart thì tạo mới cart
    if (!existingUserCart) {
      return await createCart({ userId, product });
    }

    // Nếu user có cart rồi mà cart rỗng
    if (!existingUserCart.cart_products.length) {
      existingUserCart.cart_products = [product];
      return await existingUserCart.save();
    }

    // Nếu cart đã tồn tại, Product có sẵn trong cart, thì update quantity của product
    return await updateCartItemQuantity({ userId, product });
  }

  // TH2: Click vào nút + hoặc - trong Cart
  /*
      shop_orders_ids: [
        {
          shopId,
          product_items: [
            {
              quantity, 
              productId,
              shopId,
              old_quantity,
              price
            },
          ],
          version: 2000
        }
      ]
  */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.product_items?.[0];

    const existingProduct = await getProduct({ product_id: productId });
    if (!existingProduct)
      throw new NotFoundRequestError("Error: Product does not exist");

    if (existingProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundRequestError("Error: Product does belong to the shop");

    if (quantity === 0) {
    }

    return await updateCartItemQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  // Remove cart item
  static async removeItemFromCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_status: "active" };

    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };

    const updatedCart = await cartModel.updateOne(query, updateSet);

    return updatedCart;
  }

  // Get Cart item list
  static async getCart({ userId }) {
    return await cartModel.findOne({ cart_userId: +userId }).lean();
  }
}

module.exports = CartService;
