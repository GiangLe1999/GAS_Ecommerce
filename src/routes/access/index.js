"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../middlewares/checkAuth");
const router = express.Router();

// Signup
router.post("/shop/signup", asyncHandler(accessController.signUp));
// Login
router.post("/shop/login", asyncHandler(accessController.login));

module.exports = router;
