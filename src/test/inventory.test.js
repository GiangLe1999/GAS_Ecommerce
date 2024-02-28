const redisPubSubService = require("../services/redisPubSub.service");

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe("purchase_events", (message, channel) => {
      this.updateInventory(JSON.parse(message));
    });
  }

  updateInventory({ productId, quantity }) {
    console.log(`Updated ${productId} with quantity: ${quantity} in inventory`);
  }
}

module.exports = new InventoryServiceTest();
