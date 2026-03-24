const express = require("express");
const router = express.Router();

const middleware = require("../Middleware/authMiddleware");

const { get_completion_rate, get_weekly_activity, get_xp_growth } = require("../Controllers/statsController");

//creating a router for completion rate 
router.get("/completion-rate", middleware, get_completion_rate);

//creating a router for weekly activity

router.get("/weekly-activity", middleware, get_weekly_activity);

//creating a router for xp growth

router.get("/xp-growth", middleware, get_xp_growth);

module.exports = router;