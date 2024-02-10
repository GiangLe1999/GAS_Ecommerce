const os = require("os");
const process = require("process");
const { default: mongoose } = require("mongoose");
const _SECONDS = 5000;
// Count connect
const countConnect = () => {
  const numOfConnections = mongoose.connections.length;
  console.log(`Number of connections: ${numOfConnections}`);
};

// Check over load
const checkOverload = () => {
  setInterval(() => {
    const numOfConnections = mongoose.connections.length;
    const numOfCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Giả sử mỗi core của máy chỉ chịu tải được 5 connections
    const maxConnections = numOfCores * 5;

    console.log(`Active connections: ${numOfConnections}`);
    console.log(`Memory Usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numOfConnections > maxConnections) {
      console.log(`Connection overload detected`);
    }
  }, _SECONDS); // Check every 5 seconds
};

module.exports = { countConnect, checkOverload };
