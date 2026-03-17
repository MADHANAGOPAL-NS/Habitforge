//this file contains the schema for the habit completion log..
const mongoose = require("mongoose");
const habit_log = new mongoose.Schema({
    //below is the schema for habit log...
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habit",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    completedDate: {
        type: Date,
        require: true
    },
}, {timestamps: true});

module.exports = mongoose.model("HabitLog", habit_log);

