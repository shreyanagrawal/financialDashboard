require("dotenv").config();
const jwt = require("jsonwebtoken");
const refreshCookieConfig = require("./refreshCookieConfig");

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

module.exports = generateTokens;