"use strict";

const { createClient } = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

const redisClient = createClient();
redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Promisify của util package sẽ chuyển 1 hàm thành async/await
const pexpire = promisify(redisClient.pExpire).bind(redisClient);
// Nếu không tồn tại value trong key thì set - Nếu tồn tại value thì không set
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

// NV của hàm acquireLock: Khi đang có 1 user thanh toán thì khóa lại, không cho người khác vào thanh toán đồng thời
// Trường hợp có người khác cũng đang muốn thanh toán thì cố gắng thử 10 lần
const acquireLock = async (productId, quantity, cartId) => {
  // User nào tới trước thì được cấp key trước để đặt hàng, sau đó trừ tồn kho, trả key để tiếp tục tới lượt user khác
  const key = `lock_v2024_${productId}`;
  // Số lần cho phép user thử lại để lấy key
  const retryTimes = 10;
  // Thời gian tạm lock
  const expireTime = 3000;

  for (let i = 0; i < retryTimes; i++) {
    // Tạo 1 key, user nào nắm giữ key sẽ được vào
    // Value set cho key tùy ý (không quan trọng - có thể tùy chọn như giá trị expireTime)
    // Mục đích của việc set value cho key ở đây là check kết quả biến result nhận được là 0 hay 1
    // Nếu set value cho key thành công thì result bằng 1, tức là cấp key cho user vì hiện tại chưa có user nào đang nắm giữ key
    // Nếu set value cho key không thành công thì result bằng 0, tức là không cấp key cho user vì hiện tại đang có user nắm giữ key
    // (Ta triển khai logic này được nhờ tính chất: Tại cùng 1 thời điểm setNX chỉ thực hiện set duy nhất value cho 1 key trong Redis)
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      // Nếu result === 1, tức là user được cấp key thành công, cho phép thao tác với inventory
      const reservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (reservation.modifiedCount > 0) {
        // Sau khi update reservation và cập nhật quantity trong inventory, giải phóng value hiện tại sau 3 giây để có thể set value mới cho key
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      // Nếu result === 0, tức là user chưa được cấp key, tiếp tục thử lại tối đa 10 lần, mỗi lần thử lại cách nhau 50ms
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

// Giải phóng lock bằng cách delete key
const releaseLock = async (key) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return delAsyncKey(key);
};

module.exports = {
  acquireLock,
  releaseLock,
};
