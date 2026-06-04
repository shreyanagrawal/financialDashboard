const route = require("express").Router();
const authMiddleware = require("../middleware/authMiddleWare");
const AccountModel = require("../models/Account");
const TransactionModel = require("../models/Transaction");
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

route.post("/getAccounts",async(req,res)=>{
    const userId = req.body.userid;
    if(userId){
        try{
            const accountsData = await AccountModel.find({userId:userId});
            if(accountsData)
                return res.status(200).json({success: true, message: "Records found" , accounts: accountsData})
        } catch (err){
            return res.status(404).json({success: false, message: "No records found"})

        }
    }
})

route.post("/getTransactions",async(req,res)=>{
    const userId = req.body.userid;
    if(userId){
        try{
            const transactionsData = await TransactionModel.find({userId:userId});
            if(transactionsData)
                return res.status(200).json({success: true, message: "Records found" , transactions: transactionsData})
        } catch (err){
            return res.status(404).json({success: false, message: "No records found"})

        }
    }
})

module.exports = route;