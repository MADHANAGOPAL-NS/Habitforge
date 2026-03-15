//this file contains only the logged in user can create habit and update habits and delete all the CRUD operations..

const jwt = require("jsonwebtoken");

const middle_ware = (req, res, next) => {
    const auth_header = req.headers.authorization;

    if(!auth_header){
        return res.status(401).json({message : "No token provided"});
    }

    const token = auth_header.split(" ")[1];

    //we are verifying the user and allow the CRUD operations to keep secured...
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    }

    catch(error){
        res.status(401).json({message : "Inavlid token"});
    }
};

module.exports = middle_ware;