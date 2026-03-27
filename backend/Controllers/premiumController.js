//this file contains the logic for hadnling the premium features

const mongoose = require('mongoose');

const Habit = require("../Models/Habit");

const User = require("../Models/User");

const Habit_log = require("../Models/HabitLog");

//heatmap visuvalisation

const get_heatmap = async (req, res) => {
    try {
        const userIdObj = new mongoose.Types.ObjectId(req.user.id);

        const ninetyDaysAgo = new Date();

        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const logs = await Habit_log.aggregate([{
            $match: {
                userId: userIdObj,
                completedDate: {
                    $gte: ninetyDaysAgo
                }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$completedDate" }
                },

                count: { $sum: 1 }
            }
        },

        { $sort: { _id: 1 } }]);

        res.status(200).json(logs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//30 Day consistency graph

const get_consistency_30 = async (req, res) => {
    try {
        const userIdObj = new mongoose.Types.ObjectId(req.user.id);

        const thirtyDaysAgo = new Date();

        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const logs = await Habit_log.aggregate([
            {
                $match: {
                    userId: userIdObj,
                    completedDate: {
                        $gte: thirtyDaysAgo
                    }
                }
            },

            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$completedDate" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json(logs);
    }

    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Data export as CSV

const export_habits_csv = async (req, res) => {
    try {
        const userIdObj = new mongoose.Types.ObjectId(req.user.id);

        const habits = await Habit.find({ userId: userIdObj }).lean();

        const logs = await Habit_log.find({ userId: userIdObj }).lean();

        let csv = "Habit Name,Frequency,Log Date,XP Earned\n";

        logs.forEach(log => {
            const habit = habits.find(h => h._id.toString() === log.habitId.toString());

            const habitName = habit ? habit.habitName : "Deleted Habit";

            const freq = habit ? habit.frequency : "N/A";

            const date = new Date(log.completedDate).toISOString().split('T')[0];

            csv += `"${habitName}","${freq}","${date}",${log.xpEarned || 0}\n`;

        });
        res.setHeader("Content-Type", "text/csv");

        res.setHeader("Content-Disposition", "attachment; filename=habit_data.csv");

        res.status(200).send(csv);

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//make the user as premium user

const upgrade_user = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { isPremium: true });

        res.status(200).json({ message: "Successfully upgraded to Premium!" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { get_heatmap, get_consistency_30, export_habits_csv, upgrade_user };