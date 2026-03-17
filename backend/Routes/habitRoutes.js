//this file defines the APIS routes for the controller functions.

const express = require('express');

const router = express.Router();

const {create_habit, get_habits, update_habit, delete_habit, complete_habit, get_logs} = require("../Controllers/habitController");

//to process the request and give back the response...and only logged in user can create habits
const middleware = require("../Middleware/authMiddleware");

//routing for create habit API 

router.post("/", middleware, create_habit);

//routing for get habit API

router.get("/", middleware, get_habits);

//routing for update habit API

router.put("/:id", middleware, update_habit);

//routing for delete habit API

router.delete("/:id", middleware, delete_habit);

//routing for habit completion

router.post("/:id/complete", middleware, complete_habit);

//routing for get habit logs..

router.get("/:id/logs", middleware, get_logs);

module.exports = router;