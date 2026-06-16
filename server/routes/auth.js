require("dotenv").config();
const route = require("express").Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const jwutils = require("../utils/jwebtokensUtils");
const {refreshCookieConfig} = require("../utils/cookieConfig")
const nodemailer = require('nodemailer');


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
        const {accessToken, refreshToken} = await jwutils.generateTokens(req,res,user);
        res.cookie("token",refreshToken, refreshCookieConfig);
        return res.status(200).send({accessToken, message:"User Logged in successfully"});
    } catch (err){
        return res.status(400).json({ error: err.message });
    }
})

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

let transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.EMAIL_PASSWORD
            }
        })

route.post("/sendOTP", async(req,res)=>{
    try{
        const {email} = req.body;
        const user = await UserModel.findOne({email:email});
        if(!user){
            return res.status(406).json({
                message: "User does not exists",
                status:"Failure",
            })
        }
        let otp = generateOTP();
        user.resetOtp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;

        await user.save();

        const mailoption = {
            from:process.env.EMAIL,
            to:email,
            subject:"OTP for password reset.",
            text:`Your OTP for password reset is: ${otp}`
        }

        await transporter.sendMail(mailoption);

        res.status(200).json({
            message:"OTP has been sent to your email."
        })

    }catch(error){
        res.status(500).json({error: error.message})
    }
})

route.post("/verifyotp", async(req,res)=>{
    try{
        const {email,otp} = req.body;

        const user = await UserModel.findOne({email});

        if(!user || user.resetOtp !== otp) {
            return res.status(400).json({msg: "Invalid OTP"});
        }

        if(user.otpExpiry < Date.now()){
            return res.status(400).json({msg: "OTP Expired"});
        }

        res.status(200).json({msg: "OTP verified"});
    }catch(error){
        res.status(500).json({error: error.message});
    }
})

route.post("/changepassword", async(req,res)=>{
    try{
    const {email, otp, newPassword} = req.body;

    const user = await UserModel.findOne({email});

    if(!user || user.resetOtp !== otp) {
        return res.status(400).json({msg: "Invalid OTP"});
    }

    if(user.otpExpiry < Date.now()){
        return res.status(400).json({msg: "OTP Expired"});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.otpExpiry = null;

    await user.save();  
    return res.status(200).json({msg: "Password reset successfully."});

    }catch(error){
        res.status(500).json({error: error.message});
    }
})

//for the register part
// 1. Modified sendOTP to allow sending OTP to NEW emails for registration
route.post("/sendRegistrationOTP", async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        let otp = generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins

        // For simplicity, we send the OTP. (In production, cache this OTP mapping safely)
        global.registrationOTPs = global.registrationOTPs || {};
        global.registrationOTPs[email] = { otp, expiry: otpExpiry };

        const mailoption = {
            from: process.env.EMAIL,
            to: email,
            subject: "Verify your email for registration",
            text: `Your OTP for verification is: ${otp}`
        };

        await transporter.sendMail(mailoption);
        res.status(200).json({ message: "Verification OTP has been sent to your email." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

route.post("/registerWithOTP", async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        // Verify OTP from memory/cache storage
        const cachedData = global.registrationOTPs ? global.registrationOTPs[email] : null;

        if (!cachedData || cachedData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (cachedData.expiry < Date.now()) {
            return res.status(400).json({ message: "OTP Expired" });
        }

        // OTP is valid! Proceed to create user securely
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            email,
            password: hashedPassword
        });

        await newUser.save();
        
        // Clean up cache
        delete global.registrationOTPs[email];

        return res.status(201).json({ message: "Registration Successful" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = route;