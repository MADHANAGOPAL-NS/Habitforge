const express = require('express');

const router = express.Router();

const auth_controller = require("../Controllers/authController");

router.post("/register", auth_controller.register_user);

router.post("/login", auth_controller.login_user);

module.exports = router;

