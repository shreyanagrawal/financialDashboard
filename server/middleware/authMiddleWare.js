require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const authMiddleWare = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader)
        return res.status(400).json({message:"No token found"});
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){ 
        return res.status(200).json({ authenticated: false, message:"Invalid token"}); 
    }
}
module.exports = authMiddleWare;