const redisPubSubService = require("../services/redisPubSub.service");

class ProductServiceTest {
  static purchaseProduct = async (productId, quantity) => {
    const order = { productId, quantity };
    redisPubSubService.publish("purchase_events", JSON.stringify(order));
  };
}

module.exports = ProductServiceTest;
