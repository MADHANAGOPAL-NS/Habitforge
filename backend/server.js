require("dotenv").config();
//importing the required libraries
const express = require('express');

const cors = require("cors");

const connect_DB = require("./Config/db");


//importing all the routers to the main server...

const auth_routes = require("./Routes/authRoutes");

const userRoutes = require("./Routes/userRoutes");

const habit_routes = require("./Routes/habitRoutes");

const statsRoutes = require("./Routes/statsRoutes");

const premium = require("./Routes/premiumRoutes");
//storing all the functionalities in the app variable...
const app = express();

//calling the function from another file
connect_DB();

//integrating the middleware

app.use(cors());

//since the text will be raw text in express so we are converting it into JSON format
app.use(express.json({ limit: "15mb" }));

//Routing from authRoutes.js

app.use("/api/auth", auth_routes);

//Routing from habitRoutes.js

app.use("/api/habits", habit_routes);

//user Router

app.use("/api/users", userRoutes);

//stats router

app.use("/api/stats", statsRoutes);

//premium router

app.use("/api/premium", premium);

app.get("/", (req, res) => {
    res.send("Habitforge API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server${PORT} is running successfully`);
});



