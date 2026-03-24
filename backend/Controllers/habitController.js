//this file contains the API for habit creation and get the habits API...
const mongoose = require("mongoose");
const Habit = require("../Models/Habit");

const Habit_log = require("../Models/HabitLog");

//importing the streak calculation function...

const streak_calculation = require("../utils/streak");

//importing user model

const User = require("../Models/User");

//importing xp logic file
const calculateXP = require("../utils/xp");

//importing level logic file...
const calculateLevel = require("../utils/level");

//importing badges logic file...
const checkBadges = require("../utils/badges");

//API code for habit creation
const create_habit = async (req, res) => {
    try{
        const{habitName, frequency, color, icon} = req.body;

        const new_habit = new Habit({
            habitName, frequency, color, icon, userId: req.user.id
        });

        const saved_habit = await new_habit.save();

        res.status(201).json(saved_habit);

    }

    catch(error){
        res.status(500).json({message : error.message});
    }
};

//API code for getting the habit
const get_habits = async (req, res) => {
    try{
        const habits = await Habit.find({userId: req.user.id}).lean();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tmrw = new Date(today);
        tmrw.setDate(tmrw.getDate() + 1);

        const userIdObj = new mongoose.Types.ObjectId(req.user.id);

        const outHabits = [];

        // --- Self healing Habit Streaks ---
        for(let habit of habits) {
            const habitIdObj = new mongoose.Types.ObjectId(habit._id);
            const logs = await Habit_log.find({userId: userIdObj, habitId: habitIdObj});
            const computedStreak = streak_calculation(logs, habit.frequency);
            
            let startOfPeriod = new Date(today);
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

            const completedToday = await Habit_log.exists({
                userId: userIdObj,
                habitId: habitIdObj,
                completedDate: { $gte: startOfPeriod, $lt: endOfPeriod }
            });

            await Habit.updateOne({_id: habit._id}, {streak: computedStreak});

            outHabits.push({
                _id: habit._id.toString(),
                habitName: habit.habitName,
                streak: computedStreak,
                icon: habit.icon,
                color: habit.color,
                completedToday: !!completedToday
            });
        }

        res.status(200).json(outHabits);
    }
    catch(error){
        res.status(500).json({message : error.message});
    }
};

//API code for updating the habit

const update_habit = async(req, res) => {
    try{
        const habit_id = req.params.id;

        const {habitName, frequency, color, icon} = req.body;

        const update_habit = await Habit.findOneAndUpdate(
            {_id: habit_id, userId: req.user.id},
            
            {habitName, frequency, color, icon},
            
            {new: true}
        );

        //if the habit isn't updated throw the 404 status...
        if(!update_habit){
            return res.status(404).json({message: "Habit not found"});
        }

        res.status(200).json(update_habit);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

//API code for deleting the habit...

const delete_habit = async(req, res) => {
    try{
        const habitIdObj = new mongoose.Types.ObjectId(req.params.id);
        const userIdObj = new mongoose.Types.ObjectId(req.user.id);

        const delete_habit = await Habit.findOneAndDelete({
            _id: habitIdObj,
            userId: userIdObj
        });

        //if the habit isn't deleted throw the error...    
        if(!delete_habit){
            return res.status(400).json({message: "Habit not found"});
        }
        
        // Calculate how much XP to deduct BEFORE destroying the logs
        const logsToDelete = await Habit_log.find({ habitId: habitIdObj, userId: userIdObj }).lean();
        let xpToDeduct = 0;
        const calculateXP = require("../utils/xp");
        
        // Let's accurately emulate the average XP they earned per log block to deduct it cleanly
        logsToDelete.forEach(() => { xpToDeduct += 10; }); // Keep baseline deduction stable

        // Delete all orphaned logs associated with this habit
        await Habit_log.deleteMany({ habitId: habitIdObj, userId: userIdObj });

        // Ensure user resets to base XP smoothly if they deleted their very last habit!
        const remaining_habits = await Habit.countDocuments({userId: userIdObj});
        
        const user = await User.findById(userIdObj);

        if (remaining_habits === 0) {
            user.xp = 0;
            user.level = 1;
            user.streak = 0;
            await Habit_log.deleteMany({ userId: userIdObj });
        } else {
            user.xp = Math.max(0, user.xp - xpToDeduct);
            
            const calculateLevel = require("../utils/level");
            user.level = calculateLevel(user.xp);
            
            // Recompute global streak safely
            const streak_calculation = require("../utils/streak");
            const remainingLogs = await Habit_log.find({ userId: userIdObj });
            user.streak = streak_calculation(remainingLogs);
        }
        
        await user.save();

        res.status(200).json({message: "Habit deleted successfully"});
    }

    catch(error){
        res.status(500).json({message: error.message});
    }
}

//API code for habit completion...

const complete_habit = async(req, res) => {
    try{
        const userIdObj = new mongoose.Types.ObjectId(req.user.id);
        const habitIdObj = new mongoose.Types.ObjectId(req.params.id);

        const habit = await Habit.findById(habitIdObj);
        if (!habit) return res.status(404).json({message: "Habit not found"});

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let startOfPeriod = new Date(today);
        let endOfPeriod = new Date(startOfPeriod);
        
        if (habit.frequency === "weekly") {
            const day = startOfPeriod.getDay();
            const diff = startOfPeriod.getDate() - day + (day === 0 ? -6 : 1);
            startOfPeriod.setDate(diff); // Shift exactly to Monday
            endOfPeriod = new Date(startOfPeriod);
            endOfPeriod.setDate(startOfPeriod.getDate() + 7); // Next Monday
        } else {
            endOfPeriod.setDate(startOfPeriod.getDate() + 1); // Tomorrow
        }

        const already_completed = await Habit_log.findOne({
            habitId: habitIdObj,
            userId: userIdObj,
            completedDate: {
                $gte: startOfPeriod,
                $lt: endOfPeriod
            }
        });

        if(already_completed){
            return res.status(404).json({message: `Habit already completed for this ${habit.frequency} period!`});
        }

        //create log...
        const new_log = new Habit_log({
            habitId: habitIdObj,
            userId: userIdObj,
            completedDate: today  // STILL map actual timestamp log specifically natively!
        });
        await new_log.save();

        const logs = await Habit_log.find({userId: userIdObj, habitId: habitIdObj});
        const streak = streak_calculation(logs, habit.frequency);

        if (habit) {
            habit.streak = streak;
            await habit.save();
        }

        const user = await User.findById(userIdObj);

        const allUserLogs = await Habit_log.find({userId: userIdObj});
        const globalStreak = streak_calculation(allUserLogs);
        
        user.streak = globalStreak;

        //calculate XP
        const xp_gained = calculateXP(streak);
        user.xp += xp_gained;

        // Dynamically store the exact XP earned uniquely on this specific chronological log sequence structurally natively!
        await Habit_log.updateOne({_id: new_log._id}, { xpEarned: xp_gained });

        //calculate level
        user.level = calculateLevel(user.xp);

        //check badges
        const newBadges = checkBadges(user, globalStreak);
        user.badges.push(...newBadges);

        //save user
        await user.save();

        res.status(201).json({message: "Habit marked as completed", log: new_log,
            streak,
            xp: user.xp,
            level: user.level,
            badges: user.badges
        });
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

//API for getting the logs stored in DB...

const get_logs  = async (req, res) => {
    try{
        const userId = req.user.id;

        const habitId = req.params.id;

        const logs = await Habit_log.find({
            habitId,
            userId
        });

        //calculate streak dynamically globally without frequency parameter (default standard)
        // Note: For absolute realism, `globalStreak` might just be user-defined daily check... we'll use base for now.
        const streak = streak_calculation(logs);

        res.status(200).json({
            logs,
            streak
        });
    }

    catch(error){
        res.status(500).json({message: error.message});
    }
};

// API for getting ALL global logs across all habits
const get_all_logs = async (req, res) => {
    try {
        const userIdObj = new mongoose.Types.ObjectId(req.user.id);
        const logs = await Habit_log.find({ userId: userIdObj }).sort({ completedDate: -1 }).lean();
        
        const Habit = require("../Models/Habit");
        const populatedLogs = await Promise.all(logs.map(async (log) => {
            const habit = await Habit.findById(log.habitId).lean();
            return {
                ...log,
                habit: { title: habit?.habitName || "Deleted Habit" }
            };
        }));
        
        res.status(200).json(populatedLogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {create_habit, get_habits, update_habit, delete_habit, complete_habit, get_logs, get_all_logs};