const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

// Init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Init DB

// Handle error

// Init routes
app.use(
  ("/test",
  (req, res, next) => {
    const strCompress = "Hello Giang";
    return (
      res
        .status(200)
        // String.Repeat(X) có chức năng lặp lại chuỗi X lần
        .json({ message: "Welcome", metadata: strCompress.repeat(12000) })
    );
  })
);

module.exports = app;
