"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const commentSchema = new Schema({
  comment_productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//Export the model
module.exports = mongoose.model("User", userSchema);
