require("dotenv").config();
const route = require("express").Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const generateTokens = require("../utils/generateTokens");
const cookieConfig = require("../utils/cookieConfig")

route.post("/register", async (req, res) => {
    try {
        const {email, password} = req.body;
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);
        if(email!== '' && hashedPassword!==''){
            const user = new UserModel({
                email: email,
                password: hashedPassword
            })
            await user.save();
            return res.status(201).json({ message: "User registered successfully", user });
        }
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

route.post("/login", async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await UserModel.findOne({email});
        const isMatch = await bcrypt.compare(password,user.password)
        if(!user || !isMatch)
            return res.status(400).json({ message: "User not found" });
        const {accessToken, refreshToken} = await generateTokens(req,res,user);
        res.cookie("token",refreshToken, cookieConfig);
        return res.status(200).send({accessToken, message:"User Logged in successfully"});
    } catch (err){
        return res.status(400).json({ error: err.message });
    }
})

module.exports = route;