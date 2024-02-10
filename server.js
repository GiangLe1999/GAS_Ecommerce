const app = require("./src/app");

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Bắt event khi sử dụng Ctrl + C để đóng server
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server");
  });
});
