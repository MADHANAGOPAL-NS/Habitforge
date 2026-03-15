//this file contains the API for habit creation and get the habits API...
const Habit = require("../Models/Habit");
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
        const habits = await Habit.find({userId: req.user.id});

        res.status(200).json(habits);
    }

    catch(error){
        res.status(500).json({message : error.message});
    }
};

module.exports = {create_habit, get_habits};