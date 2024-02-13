"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { checkAuthentication } = require("../../middlewares/checkAuth");
const router = express.Router();

// Signup
router.post("/shop/signup", asyncHandler(accessController.signUp));
// Login
router.post("/shop/login", asyncHandler(accessController.login));

// Authentication
router.use(checkAuthentication);

// Logout
router.delete("/shop/logout", asyncHandler(accessController.logout));
// Refresh Token
router.post(
  "/shop/refresh-token",
  asyncHandler(accessController.refreshTokenHandler)
);

module.exports = router;
