require("dotenv").config();
//importing the required libraries
const express = require('express');

const cors = require("cors");

const connect_DB = require("./Config/db");

const auth_routes = require("./Routes/authRoutes");

const habit_routes = require("./Routes/habitRoutes");
//storing all the functionalities in the app variable...
const app = express();

//calling the function from another file
connect_DB();

//integrating the middleware

app.use(cors());

//since the text will be raw text in express so we are converting it into JSON format
app.use(express.json());

//Routing from authRoutes.js

app.use("/api/auth", auth_routes);

//Routing from habitRoutes.js

app.use("/api/habits", habit_routes);

app.get("/", (req, res) =>{
    res.send("Habitforge API is running");
});

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server${PORT} is running successfully`);
});



