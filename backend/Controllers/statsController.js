//this file conttains the logic of analytics that need to be kept in stats section in the main dashboard

const mongoose = require('mongoose');

const Habit = require("../Models/Habit");

const Habit_log = require("../Models/HabitLog");

// Helper uniquely resolving "Monday-to-Sunday" bounds efficiently for natively scaling mathematically!
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

        // Bound to "Today" physically mathematically exactly locally
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

//Weekly activity chart (Strictly Fixed Monday - Sunday globally natively!)
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
                    _id: { $dayOfWeek: "$completedDate" }, // MongoDB dynamically returns 1=Sun...7=Sat
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

//XP Growth Analytics (Strictly Fixed Mon-Sun dynamically capturing exact XP mathematically!)
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
                    // Extract exactly `YYYY-MM-DD` natively gracefully
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedDate" } },
                    // Seamlessly aggregate the actual exact XP dynamically gained, falling back statically to basic math if records are structurally old natively.
                    xp: { $sum: { $ifNull: ["$xpEarned", 10] } }
                }
            }
        ]);

        const xpData = [];
        // Architect the entire 7 day span dynamically whether empty mathematically or fully loaded!
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            const isoString = d.toISOString().split("T")[0];

            const match = results.find(r => r._id === isoString);
            xpData.push({
                date: isoString,
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