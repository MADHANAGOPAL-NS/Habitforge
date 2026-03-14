const mongoose = require('mongoose');

//giving connection to Mongo DB Atlas

const connect_DB = async() => {
    //using try and catch block for connection assurance...
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB connected successfully");
    }

    catch(error){
        console.log("Database connection error:", error);
    }
};

//to pass this async function to access in other files
module.exports = connect_DB;