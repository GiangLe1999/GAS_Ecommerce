"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, port },
} = require("../configs/config.mongodb");
const { countConnect } = require("../helpers/check.connect");

// Trong thực tế, cần khai báo trong file .env
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  // Type có thê thay đổi linh hoạt là Oracle, Postgres,...
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, { maxPoolSize: 100 })
      .then((_) => {
        console.log(`Connected to MongoDB successfully: ${connectString}`);
        countConnect();
      })
      .catch((err) => console.log(`Failed to connect to MongoDB`));
  }

  static getInstance() {
    // Nếu chưa có instance nào của class Database tồn tại thì tạo 1 instance mới
    // Ngược lại, nếu đã có instance tồn tại rồi thì return instance đó
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

// Gọi static method getInstance của class Database để get về và export Database instance
// Database instance này sẽ chạy ngay method connect với chức năng connect tới database
const mongodbInstance = Database.getInstance();
module.exports = mongodbInstance;
