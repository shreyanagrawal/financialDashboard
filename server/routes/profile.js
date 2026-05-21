const route = require("express").Router();
const authMiddleware = require("../middleware/authMiddleWare");
const UserModel = require("../models/User");
const {refreshCookieConfig} = require("../utils/cookieConfig");

route.get("/", authMiddleware, async(req,res)=>{
    try{
        const user = await UserModel.findById(req.user.userId);
        return res.status(200).json({user});
    }catch(err){
        res.clearCookie("token", refreshCookieConfig);
        return res.status(500).json({message: err.message});
    }
});

module.exports = route;