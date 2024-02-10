"use strict";

const mongoose = require("mongoose");

// Trong thực tế, cần khai báo trong file .env
const connectString = `mongodb://localhost:27017/shopDEV`;

mongoose
  .connect(connectString)
  .then((_) => console.log(`Connected to MongoDB successfully`))
  .catch((err) => console.log(`Failed to connect to MongoDB`));

// Dev environment
if (1 === 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
