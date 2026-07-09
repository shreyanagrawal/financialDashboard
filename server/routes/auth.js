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
        return res.status(200).send({accessToken, message:"User Logged in successfully"});
    } catch (err){
        return res.status(400).json({ error: err.message });
    }
})

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

let transporter = nodemailer.createTransport({
        host: "74.125.142.108", 
    port: 465,             // Switching to secure SSL port 465 works better with raw IPs
    secure: true,          // true for 465
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        // Tells Nodemailer to accept Gmail's certificate even though we used an IP address
        rejectUnauthorized: false
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
           from: `"Financial Dashboard Platform" <${process.env.EMAIL}>`,
             to: email,
             subject: "Verify your email for registration",
             html: `
                <h2>Welcome to Personal Financial Dashboard Platform </h2>
                <p>Your verification code is:</p>
                <h1>${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this code, please ignore this email.</p>
                `
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
    const {email, otp, newPassword, currentPassword, userId} = req.body;
    let user;

    if (currentPassword && userId) {
            user = await UserModel.findById(userId);
            if (!user) return res.status(404).json({ msg: "User not found" });

            // Verify they know their current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Incorrect current password." });
        }
    else if (otp && email) {
            user = await UserModel.findOne({ email });
            
            if (!user || user.resetOtp !== otp) {
                return res.status(400).json({ msg: "Invalid OTP" });
            }
            if (user.otpExpiry < Date.now()) {
                return res.status(400).json({ msg: "OTP Expired" });
            }
            
            // Clear OTP fields so they can't be reused
            user.resetOtp = null;
            user.otpExpiry = null;
        }

    else {
            return res.status(400).json({ msg: "Invalid request. Missing required fields." });
        }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

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
         console.log("1. Request received");
        const { email } = req.body;
         console.log("2. Before Mongo");
        
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
         console.log("3. Mongo completed");
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        let otp = generateOTP();
        console.log("4. OTP generated");
        const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins

        // For simplicity, we send the OTP. (In production, cache this OTP mapping safely)
        global.registrationOTPs = global.registrationOTPs || {};
        global.registrationOTPs[email] = { otp, expiry: otpExpiry };
        console.log("5. Before sendMail");

        const mailoption = {
           from: `"Financial Dashboard Platform" <${process.env.EMAIL}>`,
             to: email,
             subject: "Verify your email for registration",
             html: `
                <h2>Welcome to Personal Financial Dashboard Platform </h2>
                <p>Your verification code is:</p>
                <h1>${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this code, please ignore this email.</p>
                `
        };

        await transporter.sendMail(mailoption);
        
        console.log("6. Email sent");
        res.status(200).json({
            message: "OTP sent"
        });
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

route.post("/update", async(req,res)=>{
    const {name,_id, password} = req.body.userData; 
    try{
        const updatedData = await UserModel.findOneAndUpdate(
            {
                _id
            },
            {
                _id,
                name: name,
                password: password
            },
            {
                upsert: true,
                returnDocument: "after",
            },
        );
        if(updatedData)
            return res.status(200).json({"success": true, "message": "Data updated successfully", data:updatedData})

    } catch (error){
        return res.status(500).json({"success": false, "message": "Some internal server error occurred"})
    }
})

module.exports = route;