const mongoose = require('mongoose');

//this file has the code for the user schema which means how the data is gonna be sitted in Mongo DB...

const user_schema = new mongoose.Schema({
    //the below code has the attribute and the type of data
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    xp: {
        type: Number,
        default: 0
    },

    level: {
        type: Number,
        default: 1
    },

    badges: {
        type: [String],
        default: []
    },

    isPremium: {
        type: Boolean,
        default: false
    },

    streak: {
        type: Number,
        default: 0
    },

    profilePicture: {
        type: String,
        default: ""
    }

}, {timeStamps: true});

module.exports = mongoose.model("User", user_schema);