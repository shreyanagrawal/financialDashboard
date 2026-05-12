require("dotenv").config();
const route = require("express").Router();
const jwt = require("jsonwebtoken");
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const cookieConfig = require("../utils/cookieConfig");

route.post("/", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) 
            return res.status(401).json({message: "Cannot find refresh token"});
        const { decoded } = await verifyRefreshToken(req, token);
        const payload = {userId: decoded.userId};
        const accessToken = jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn: "10m" });
        return res.status(200).json({accessToken,message: "Access token created successfully"});
    } catch (err) {
        res.clearCookie("token", cookieConfig);
        return res.status(401).json({message: "Invalid refresh token",error: err.message});
    }
});

route.delete("/",async(req,res)=>{
    const token = req.cookies.token;
    try{
        if(!token){
            res.clearCookie("token", cookieConfig);
            return res.status(400).json({message:"Cant find the token"});
        }
        res.clearCookie("token", cookieConfig);
        return res.status(200).json({message:"User Logged out Succesfully"});
    }
    catch(err){
        res.clearCookie("token", cookieConfig);
        return res.status(500).json({message:"Internal Server Error"});
    }

})

module.exports = route
