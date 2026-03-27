//this file contains tehe routing of premium feature

const express = require('express');
const router = express.Router();

const auth = require("../Middleware/authMiddleware");

const User = require("../Models/User");

const { get_heatmap, get_consistency_30, export_habits_csv, upgrade_user } = require("../Controllers/premiumController");

const checkPremium = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (user && user.isPremium) {
        next();
    }
    else {
        res.status(403).json({ message: "Premium subscription required for this feature." });
    }
};

//routing for heatmap
router.get("/heatmap", auth, checkPremium, get_heatmap);

//routing for 30 day consistency graph
router.get("/consistency-30", auth, checkPremium, get_consistency_30);

//routing for data export as CSV
router.get("/export", auth, checkPremium, export_habits_csv);

//router for upgrading the user as premium

router.post("/upgrade", auth, upgrade_user);

module.exports = router;

