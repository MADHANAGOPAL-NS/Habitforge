//this file contains the API for habit creation and get the habits API...
const Habit = require("../Models/Habit");

const Habit_log = require("../Models/HabitLog");
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
        const habit_id = req.params.id;

        const delete_habit = await Habit.findOneAndDelete({
            _id: habit_id,
            userId: req.user.id
        });

        //if the habit isn't deleted throw the error...    
        if(!delete_habit){
            return res.status(400).json({message: "Habit not found"});
        }
        
        res.status(200).json({message: "Habit deleted successfully"});
    }

    catch(error){
        res.status(500).json({message: error.message});
    }
}

//API code for habit completion...

const complete_habit = async(req, res) => {
    try{
        const userId = req.user.id;

        const habitId = req.params.id;

        //converting the time to 12 Hours format 00:00 

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        //for checking dupliacte log below is the logic..we dont see the time we see the range of the time...

        const already_completed = await Habit_log.findOne({
            habitId,
            userId,
            //we are checking whether the date range is within today 12 hrs and tmrw 12 hrs...
            completedDate: {
                $gte: today,
                $lt: tomorrow
            }

        });

        if(already_completed){
            return res.status(404).json({message: "Habit already completed for today"});
        }

        //create log...
        const new_log = new Habit_log({
            habitId,
            userId,
            completedDate: today
        });

        await new_log.save();

        res.status(201).json({message: "Habit marked as completed", log: new_log});
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
        }).sort({completedDate: -1});

        res.status(200).json(logs);
    }

    catch(error){
        res.status(500).json({message: error.message});
    }
};
module.exports = {create_habit, get_habits, update_habit, delete_habit, complete_habit, get_logs};