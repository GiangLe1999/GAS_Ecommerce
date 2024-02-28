const { createClient } = require("redis");

const publisher = createClient();
publisher
  .connect()
  .then(() => {
    console.log("Connected to Redis Publisher");
  })
  .catch((err) => {
    console.log(err.message);
  });

const subscriber = createClient();
subscriber
  .connect()
  .then(() => {
    console.log("Connected to Redis Subscriber");
  })
  .catch((err) => {
    console.log(err.message);
  });

class RedisPubSubService {
  async publish(channel, message) {
    await publisher.publish(channel, message);
  }

  async subscribe(channel, callback) {
    subscriber.subscribe(channel, callback);
  }
}

module.exports = new RedisPubSubService();
