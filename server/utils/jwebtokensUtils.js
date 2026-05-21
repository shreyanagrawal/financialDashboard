require("dotenv").config();
const jwt = require("jsonwebtoken");
const {refreshCookieConfig} = require("./cookieConfig");

const verifyRefreshToken = async(req,refreshToken)=>{
    try{
        const privateKey = process.env.REFRESH_SECRET;
        const tokenDoc = req.cookies.token;
        if(!tokenDoc){
            res.clearCookie("token", refreshCookieConfig);
            throw new Error("Invalid Refresh token");
        }
        const decoded = jwt.verify(refreshToken,  privateKey);
        return {decoded, message: "Valid Refresh Token"};
    } catch(err){
        throw err;
    }
}

const generateTokens = async(req,res,user)=>{
    try{
        const payload = {userId: user._id};
        const accessToken = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"10m"});
        const refreshToken = jwt.sign(payload,process.env.REFRESH_SECRET,{expiresIn:"30d"});
        res.cookie("token",refreshToken, refreshCookieConfig);
        return Promise.resolve({accessToken,refreshToken});
    }
    catch(err){
        return Promise.reject(err);
    }
}
module.exports = {verifyRefreshToken, generateTokens}