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
            if(accountsData.length > 0)
                return res.status(200).json({success: true, message: "Records found" , accounts: accountsData})
            else 
                return res.status(200).json({success: false, message: "No Records found"})
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
            if(transactionsData.length > 0)
                return res.status(200).json({success: true, message: "Records found" , transactions: transactionsData})
            else 
                return res.status(200).json({success: false, message: "No Records found"})
        } catch (err){
            return res.status(404).json({success: false, message: "No records found"})
        }
    }
})

route.post("/updateAccountsLink", async(req,res)=>{
    const accountId = req.body.accountId;
    const userId = req.body.userId;
    const linked = req.body.isLinked
    if(accountId !== '' && userId !== ''){
        try{
            const resData = await AccountModel.updateOne(
                {
                    userId:userId,
                    "items.accounts.accountId": accountId 
                }, 
                {
                     $set: {
                        "items.$[item].accounts.$[account].isActive": linked ? false: true,
                        "items.$[item].accounts.$[account].disconnectedAt": linked ? new Date : null,
                    }
                },
                {
                    arrayFilters: [
                    {
                        "item.accounts.accountId": accountId
                    },
                    {
                        "account.accountId": accountId
                    }
                    ]
                }
            );
            if(resData){                    
                return res.status(200).json({success: true, message: linked ? "Account unlinked successfully" : "Account linked successfully"})
            } else 
                return res.status(404).json({success: false, message: "Requested account id not found"})
        } catch (error){
            console.log(error);
            return res.status(500).json({success:false, message:error})
        }
    }
})

module.exports = route;