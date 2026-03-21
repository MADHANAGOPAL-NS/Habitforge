//import express library
const express = require('express');

const router = express.Router();

const auth_controller = require("../Controllers/authController");

//creating API for registration
router.post("/register", auth_controller.register_user);

//creating API for login
router.post("/login", auth_controller.login_user);

module.exports = router;

