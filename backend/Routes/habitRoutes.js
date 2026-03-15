//this file defines the APIS routes for the controller functions.

const express = require('express');

const router = express.Router();

const {create_habit, get_habits} = require("../Controllers/habitController");

//to process the request and give back the response...and only logged in user can create habits
const middleware = require("../Middleware/authMiddleware");

//create habit API 

router.post("/", middleware, create_habit);

//get habit API

router.get("/", middleware, get_habits);

module.exports = router;