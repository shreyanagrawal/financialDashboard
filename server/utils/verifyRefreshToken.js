require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieConfig = require("./cookieConfig");
const verifyRefreshToken = async(req,refreshToken)=>{
    try{
        const privateKey = process.env.REFRESH_SECRET;
        const tokenDoc = req.cookies.token;
        if(!tokenDoc){
            res.clearCookie("token", cookieConfig);
            throw new Error("Invalid Refresh token");
        }
        const decoded = jwt.verify(refreshToken,  privateKey);
        return {decoded, message: "Valid Refresh Token"};
    } catch(err){
        throw err;
    }
};
module.exports = verifyRefreshToken;