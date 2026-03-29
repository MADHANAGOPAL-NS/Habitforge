//this file contains the logic of analytics that need to be kept in stats section in the main dashboard

const mongoose = require('mongoose');

const Habit = require("../Models/Habit");

const Habit_log = require("../Models/HabitLog");

// Timezone used for all date operations — must match the timezone used when storing completedDate
const USER_TIMEZONE = "Asia/Kolkata";

// Helper resolving "Monday-to-Sunday" bounds in the user's local timezone
const getWeekBounds = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = today.getDate();
    const day = today.getDay(); // 0 is Sun, 1 is Mon...
    const diffToMonday = date - day + (day === 0 ? -6 : 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(diffToMonday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Next Monday!

    return { startOfWeek, endOfWeek };
};

//1. Completion analytics which consist of the bargraph which tells how many percent of habits completed daily/weekly
const get_completion_rate = async (req, res) => {
    try {
        const userIdObj = new mongoose.Types.ObjectId(req.user.id);

        const totalhabits = await Habit.countDocuments({ userId: userIdObj });

        // Bound to "Today" in local timezone
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tmrw = new Date(today);
        tmrw.setDate(tmrw.getDate() + 1);

        const completedHabitsArray = await Habit_log.find({
            userId: userIdObj,
            completedDate: { $gte: today, $lt: tmrw }
        }).distinct("habitId");

        const completedHabits = completedHabitsArray.length;

        const completionRate = totalhabits === 0 ? 0 : Math.round((completedHabits / totalhabits) * 100);

        res.status(200).json({
            totalhabits, completedHabits, completionRate
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Weekly activity chart (Strictly Fixed Monday - Sunday with correct timezone!)
const get_weekly_activity = async (req, res) => {
    try {
        const userIdObj = new mongoose.Types.ObjectId(req.user.id);
        const { startOfWeek, endOfWeek } = getWeekBounds();

        const results = await Habit_log.aggregate([
            {
                $match: {
                    userId: userIdObj,
                    completedDate: { $gte: startOfWeek, $lt: endOfWeek }
                }
            },
            {
                $group: {
                    // Use timezone-aware $dayOfWeek so Saturday IST isn't misread as Friday UTC
                    _id: { $dayOfWeek: { date: "$completedDate", timezone: USER_TIMEZONE } },
                    count: { $sum: 1 }
                }
            }
        ]);

        const weeklyData = [
            { day: "Mon", count: 0 },
            { day: "Tue", count: 0 },
            { day: "Wed", count: 0 },
            { day: "Thu", count: 0 },
            { day: "Fri", count: 0 },
            { day: "Sat", count: 0 },
            { day: "Sun", count: 0 }
        ];

        // MongoDB $dayOfWeek: 1=Sun, 2=Mon, ... 7=Sat
        const dbIndexToLocal = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 1: 6 };

        results.forEach(r => {
            if (dbIndexToLocal[r._id] !== undefined) {
                weeklyData[dbIndexToLocal[r._id]].count = r.count;
            }
        });

        res.status(200).json(weeklyData);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//XP Growth Analytics (Strictly Fixed Mon-Sun with correct timezone!)
const get_xp_growth = async (req, res) => {
    try {
        const userIdObj = new mongoose.Types.ObjectId(req.user.id);
        const { startOfWeek, endOfWeek } = getWeekBounds();

        const results = await Habit_log.aggregate([
            {
                $match: {
                    userId: userIdObj,
                    completedDate: { $gte: startOfWeek, $lt: endOfWeek }
                }
            },
            {
                $group: {
                    // Use timezone-aware $dateToString so the date string matches the local day
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedDate", timezone: USER_TIMEZONE } },
                    xp: { $sum: { $ifNull: ["$xpEarned", 10] } }
                }
            }
        ]);

        const xpData = [];
        // Build the entire 7-day span using local date strings
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            // Format as YYYY-MM-DD in local timezone (matching what $dateToString with timezone produces)
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const localDateStr = `${year}-${month}-${day}`;

            const match = results.find(r => r._id === localDateStr);
            xpData.push({
                date: localDateStr,
                xp: match ? match.xp : 0
            });
        }

        res.status(200).json(xpData);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { get_completion_rate, get_weekly_activity, get_xp_growth };