//this file contains the schema for habits to store in mongo DB

//import the libraries

const mongoose = require('mongoose');

//creating the schema
const habit_schema = new mongoose.Schema({
    
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },

    habitName: {
        type : String,
        required: true
    },

    frequency: {
        type: String,
        enum: ["daily", "weekly"],
        required: true
    },

    color: {
        type: String
    },

    icon: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Habit", habit_schema);