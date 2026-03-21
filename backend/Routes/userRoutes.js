const express = require("express");
const router = express.Router();

const User = require("../Models/User");
const authMiddleware = require("../Middleware/authMiddleware");
const Habit_log = require("../Models/HabitLog");
const Habit = require("../Models/Habit");
const streak_calculation = require("../utils/streak");
const mongoose = require("mongoose");

router.get("/dashboard", authMiddleware, async(req, res) => {

    try{

        const userIdObj = new mongoose.Types.ObjectId(req.user.id || req.user._id);

        // Force a total independent sync of the true streak mathematical value perfectly directly to DB
        const allLogs = await Habit_log.find({userId: userIdObj});
        let globalStreak = streak_calculation(allLogs);
        
        const user = await User.findById(userIdObj).lean();
        if(!user){
            return res.status(400).json({message: "user not found"});
        }

        const activeHabitsCount = await Habit.countDocuments({userId: userIdObj});
        let targetXp = user.xp;
        let targetLevel = user.level;

        // Force XP reset exactly back to baseline if NO Habits exist (to catch any external/API deletions)
        if (activeHabitsCount === 0) {
            globalStreak = 0;
            targetXp = 0;
            targetLevel = 1;
        }

        await User.updateOne({_id: userIdObj}, {
            streak: globalStreak,
            xp: targetXp,
            level: targetLevel
        });

        // Dynamic Notification Engine
        const notifications = [];
        
        // 1. Let's see if they have ANY completely unchecked habits currently available right now
        const habitsList = await Habit.find({ userId: userIdObj }).lean();
        let hasPendingTasks = false;
        
        const todayAtMidnight = new Date();
        todayAtMidnight.setHours(0,0,0,0);
        
        for (let habit of habitsList) {
            let startOfPeriod = new Date(todayAtMidnight);
            let endOfPeriod = new Date(startOfPeriod);
            
            if (habit.frequency === "weekly") {
                const day = startOfPeriod.getDay();
                const diff = startOfPeriod.getDate() - day + (day === 0 ? -6 : 1);
                startOfPeriod.setDate(diff); // Shift to exactly Monday
                endOfPeriod = new Date(startOfPeriod);
                endOfPeriod.setDate(startOfPeriod.getDate() + 7); // Exactly Next Monday
            } else {
                endOfPeriod.setDate(startOfPeriod.getDate() + 1); // Exactly Tomorrow
            }
            
            const isCompletedThisPeriod = await Habit_log.exists({
                userId: userIdObj,
                habitId: habit._id,
                completedDate: { $gte: startOfPeriod, $lt: endOfPeriod }
            });
            
            // If we found at least one habit that hasn't been checked yet, they absolutely still have work to do!
            if (!isCompletedThisPeriod) {
                hasPendingTasks = true;
                break;
            }
        }
        
        if (hasPendingTasks) {
            notifications.push("🔥 Complete your habit today!");
            if (globalStreak > 0) {
                notifications.push("⚠️ Don’t break your streak!");
            }
        }
        
        if (user.badges && user.badges.length > 0) {
            // In a larger app we track read status, but for now show it purely dynamically
            notifications.push("🏆 You earned a new badge!");
        }

        res.json({
            name: user.name,
            xp: targetXp,
            level: targetLevel,
            badges: user.badges,
            streak: globalStreak,
            profilePicture: user.profilePicture || "",
            notifications: notifications
        });
    }

    catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"});
    }
});

router.put("/settings", authMiddleware, async (req, res) => {
    try {
        const userIdObj = new mongoose.Types.ObjectId(req.user.id || req.user._id);
        const { name, profilePicture } = req.body;
        
        await User.updateOne(
            { _id: userIdObj }, 
            { name: name, profilePicture: profilePicture }
        );
        
        res.status(200).json({ message: "Profile updated successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update profile settings" });
    }
});

module.exports = router;