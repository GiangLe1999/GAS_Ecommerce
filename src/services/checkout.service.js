"use strict";

const { getCartById } = require("../models/repositories/cart.repo");
const { BadRequestError } = require("../core/error.response");
const {
  checkProductsAreValid,
} = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  /*
    {
      cartId
      userId
      shop_order_ids: [
        // shop_order_ids là mảng gồm order từ nhiều shop khác nhau
        // Mỗi element của shop_order_ids sẽ thuộc 1 shop
        {
          shopId,
          // Vì 1 SP có thể áp dụng nhiều discount nên ta truyền dạng mảng
          shop_discounts: [
            {
              shopId,
              discountId,
              code
            }
          ]
          product_items: [{
            price,
            quantity,
            productId
          }]
        }
      ]
    }
  */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const existingCart = await getCartById(cartId);
    if (!existingCart) {
      throw new BadRequestError("Error: Cart does not exist");
    }

    const checkout_order = {
      totalPrice: 0,
      shipFee: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    // Lặp qua order của tất cả các shop và tính tổng tiền bill
    const new_shop_order_ids = [];
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        product_items = [],
        shop_discounts = [],
      } = shop_order_ids[i];

      // Check các product có thật sự tồn tại trong db hay không
      const validProducts = await checkProductsAreValid(product_items);

      if (!validProducts[0])
        throw new BadRequestError("Error: Invalid product");

      // Tổng tiền đơn hàng của 1 shop
      const checkoutPrice = validProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );

      // Tổng tiền đơn hàng trước khi xử lý
      checkout_order.totalPrice += checkoutPrice;

      const checkoutItem = {
        shopId,
        shop_discounts,
        // rawPrice là tiền trước khi giảm giá
        rawPrice: checkoutPrice,
        afterDiscountPrice: checkoutPrice,
        product_items: validProducts,
      };

      // Nếu shop_discounts.length > 0 thì check xem discount có hợp lệ không
      if (shop_discounts.length > 0) {
        const { discountAmount = 0 } = await getDiscountAmount({
          code: shop_discounts[0].code,
          userId,
          shopId,
          products: validProducts,
        });

        checkout_order.totalDiscount += discountAmount;

        if (discountAmount > 0) {
          checkoutItem.afterDiscountPrice = checkoutPrice - discountAmount;
        }
      }

      // Tổng tiền thanh toán cuối cùng
      checkout_order.totalCheckout += checkoutItem.afterDiscountPrice;
      new_shop_order_ids.push(checkoutItem);
    }

    return { checkout_order, shop_order_ids, new_shop_order_ids };
  }
}

module.exports = CheckoutService;
