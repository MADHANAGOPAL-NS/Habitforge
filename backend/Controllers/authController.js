//this file contains the logic of authentication for user both register and login...

const User = require("../Models/User");

//the below line is for hashing the password that is gonna stored in Mongo DB
const bcrypt = require("bcryptjs");

//to verify the user while login we use JWT below is the code

const jwt = require("jsonwebtoken");

//Registering user

const register_user  = async(req, res) => {

    try{
        const {name, email, password} = req.body;

        //checking if the user already exist or not

        const exist_user = await User.findOne({email});

        //return 400 status
        if(exist_user){
            return res.status(400).json({message : "user already exist"});
        }

        //Hash the password by using the salt method(to add random string before hashing)
        const salting = await bcrypt.genSalt(10);
        const hashed_pwd = await bcrypt.hash(password, salting);

        //logic for creating user

        const user = new User({
            name, email, password: hashed_pwd
        });

        await user.save();

        //acknowledgement after registering
        res.status(201).json({message : "User registered successfully"});

    }

    catch(error){
        res.status(500).json({message: error.message});
    }
};

//Login User

const login_user = async(req, res) => {

    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        //if the user is not register the logic below will work
        if(!user){
            return res.status(400).json({message : "Invalid email or password"});
        }

        //if the credentials are wrong the logic is below
        const wrong_cred = await bcrypt.compare(password, user.password);

        if(!wrong_cred){
            return res.status(400).json({message: "Inavlid email or password"});
        }

        //jwt token sign and expiry date
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.json({
            token,
            user
        });

    }

    catch(error){
        res.status(500).json({message: error.message});
    }
};

// Reset Password
const reset_password = async(req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        const salting = await bcrypt.genSalt(10);
        const hashed_pwd = await bcrypt.hash(newPassword, salting);

        user.password = hashed_pwd;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {register_user, login_user, reset_password};
