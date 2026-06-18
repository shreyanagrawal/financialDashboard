const router = require("express").Router();
const {plaidCookieConfig} = require("../utils/cookieConfig");
const plaidUtils = require("../utils/plaidUtils");
const PlaidItem = require("../models/Plaid");
const AccountModel = require("../models/Account");
const TransactionModel = require("../models/Transaction");
const BudgetModel = require("../models/Budget");
const mongoose = require("mongoose");
router.post("/create-link-token", async (req, res) => {
  try {
    const response = await plaidUtils.client.linkTokenCreate({
      user: {
        client_user_id: "user-id",
      },
      client_name: "PFM Dashboard",
      products: ["auth","transactions"],
      country_codes: ["US"],
      language: "en",
    });
    // res.cookie("plaidToken",response.data.link_token,plaidCookieConfig)
    res.json(response.data);
  } catch (error) {
    console.log("PLAID ERROR:");
    console.log(JSON.stringify(error.response?.data, null, 2));

    res.status(500).json({
      error: true,
      data: error.response?.data,
      message: error.message
    });
  }
});


router.post('/exchange_public_token', async (req,res,) => {
  const publicToken = req.body.public_token;
  const userId = req.body.user_id;
  try {
    const tokenResponse = await plaidUtils.client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    
    const accessToken = tokenResponse.data.access_token;
    const itemID = tokenResponse.data.item_id;
    const institutionDetails = await institutionInfo(accessToken);
    const encryptedAcessToken = plaidUtils.encrypt(accessToken);
    await PlaidItem.findOneAndUpdate(
      {
        userId
      },
      {
        userId,
        plaidItemId: itemID,
        encryptedAccessToken: encryptedAcessToken,
        institutionName: institutionDetails

      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );
    // res.clearCookie("plaidToken");
    const balancesData = await getBalances(req.body.user_id, itemID);
    const transactionsData = await getTransactions(req.body.user_id, itemID);
    res.json({ success: true , message: "Bank Connected Succesfully", balances: balancesData, transactions: transactionsData });

  } catch (error) {
    console.log("PLAID ERROR:");
    console.log(JSON.stringify(error.response?.data, null, 2));
    res.status(500).json({
      error: true,
      data: error.response?.data,
      message: error.message
    });
  }
});

// router.post('/auth', async function (req, res) {
//   try {
//     const userId = req.body.user_id;

//     const accessToken = await getAccessToken(userId); 
    
//     //Very very importnat  {Use decrypted token in Plaid API}
//     const accountResponse = await client.authGet({
//       access_token: accessToken,
//     })

//     res.json(accountResponse.data);

//   } catch (error) {

//   console.log("PLAID ERROR:");
//   console.log(error.response?.data || error.message);

//   res.status(500).json({
//     error: true,
//     message:
//       error.response?.data?.error_message ||
//       error.message,
    
//     error_code:
//       error.response?.data?.error_code,

//     error_type:
//       error.response?.data?.error_type,
//   });
// }
// });

router.post('/link-token/update', async (req, res) => {
  try {
    const { userId, plaidItemId } = req.body;
    if (!userId || !plaidItemId) {
      return res.status(400).json({
        error: true,
        message: 'userId and plaidItemId are required'
      });
    }

    const accessToken = await plaidUtils.getAccessToken(userId,plaidItemId);
    console.log("accessToken:", accessToken);
    const linkToken = await plaidUtils.createUpdateModeLinkToken(userId, accessToken);
    const institutionDetails = await institutionInfo(accessToken);
    res.status(200).json({link_token: linkToken,institutionName: institutionDetails});

  } catch (error) {
    console.log("PLAID ERROR:");
    console.log("In update");
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

router.post('/sync-accounts', async (req, res) => {
  try {
    const { userId, plaidItemId } = req.body;
    if (!userId || !plaidItemId) {
      return res.status(400).json({error: true,message: 'userId and plaidItemId are required'});
    }
    const accessToken = await plaidUtils.getAccessToken(userId,plaidItemId);
    const response = await plaidUtils.client.accountsBalanceGet({
      access_token: accessToken,
    });
    const institutionDetails = await institutionInfo(accessToken);
    const accounts = response.data.accounts;
    const syncResult = await syncAccountsAfterUpdate(userId, plaidItemId, accounts, institutionDetails);

    res.status(200).json({
      success: true,
      newAccountsAdded: syncResult.newAccountsAdded,
      existingAccountsPreserved: syncResult.existingAccountsPreserved,
      newAccounts: syncResult.newAccounts,
      existingAccounts: syncResult.existingAccounts,
      syncedAt: new Date()
    });

  } catch (error) {
    console.log("Sync accounts")
    console.log("PLAID ERROR:");
    console.log(error.message);
    res.status(500).json({error: true, message: error.message});
  }
});

const syncAccountsAfterUpdate = async (userId, plaidItemId, plaidAccounts, institutionName) => {
  const accessToken = await plaidUtils.getAccessToken( userId, plaidItemId );
  const itemResponse = await plaidUtils.client.itemGet({ access_token: accessToken, }); 
  const institutionId = itemResponse.data.item .institution_id;
  const storedAccount = await AccountModel.findOne({
    userId,
    institutionId
  }).select( "+items.encryptedAccessToken" );
  if (!storedAccount) {
    const newAccounts = plaidAccounts.map(account => ({
      plaidItemId,
      accountId: account.account_id,
      name: account.name,
      type: account.type,
      subtype: account.subtype,
      mask: account.mask,
      balances: {
        available: account.balances.available,
        current: account.balances.current,
        limit: account.balances.limit,
        currency: account.balances.iso_currency_code,
      },
      persistentAccountId: account.persistent_account_id,
    }));
    await AccountModel.create({
      userId,
      plaidItemId,
      institutionId,
      officialName: institutionName,
      items:[
        {
          plaidItemId,
          encryptedAccessToken: plaidUtils.encrypt(accessToken)
        }
      ],
      accounts: newAccounts
    });
    return {
      newAccountsAdded: newAccounts.length,
      existingAccountsPreserved: 0,
      newAccounts,
      existingAccounts: []
    };
  }

  const itemExists = storedAccount.accounts.some((a)=>a.plaidItemId === plaidItemId);
  if(!itemExists){
    storedAccount.items.push({
      plaidItemId,
      encryptedAccessToken: plaidUtils.encrypt(accessToken)
    })
  }
  const existingAccountIds = storedAccount.accounts.map((acc)=>acc.accountId)
  const newAccountsData = plaidAccounts.filter(
    account => !existingAccountIds.includes(account.account_id)
  );
  const formattedNewAccounts = newAccountsData.map((account)=>({
    plaidItemId,
    accountId: account.account_id,
    name: account.name,
    type: account.type, 
    subtype: account.subtype, 
    mask: account.mask, 
    balances: { 
      available: account.balances .available, 
      current: account.balances .current, 
      limit: account.balances .limit, 
      currency: account.balances .iso_currency_code, 
    }, 
    persistentAccountId: account .persistent_account_id,
  }))
  storedAccount.accounts.push(...formattedNewAccounts);
  storedAccount.updatedAt = new Date();
  await storedAccount.save();
  return {
    newAccountsAdded: formattedNewAccounts.length,
    existingAccountsPreserved: existingAccountIds.length,
    newAccounts: formattedNewAccounts,
    existingAccounts: storedAccount.accounts
  };
};

const institutionInfo = async (accessToken) => {
  let itemResponse;
  try{
    itemResponse = await plaidUtils.client.itemGet({
      access_token: accessToken,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
  
  const institutionId = itemResponse.data.item.institution_id;
  const institutionResponse = await plaidUtils.client.institutionsGetById({
    institution_id: institutionId,
    country_codes: ["US"],
  });
  return institutionResponse.data.institution.name;
};

const getTransactions = async(userId, itemID)=>{
  try{
    const accessToken = await plaidUtils.getAccessToken(userId, itemID);
     const response = await plaidUtils.client.transactionsGet({
      access_token: accessToken,
      start_date: "2024-01-01",
      end_date: new Date().toISOString().split("T")[0],
    });
    const itemResponse = await plaidUtils.client.itemGet({
      access_token: accessToken,
    });
    const transactions = response.data.transactions;
    await TransactionModel.updateOne(
      {
        userId,
        plaidItemId: itemID,
      },
      {
        $set: {
          transactions: transactions.map((tx) => ({
            accountId: tx.account_id,
            transactionId: tx.transaction_id,
            name: tx.name,
            amount: tx.amount,
            category: tx.category?.length
              ? tx.category
              : ["Other"],
            merchantName: tx.merchant_name || tx.name,
            date: tx.date,
            pending: tx.pending,
          })),
        },
        $setOnInsert: {
          userId,
          plaidItemId: itemID,
        },
      },
      {
        upsert: true,
      }
    );
    return transactions;
  }catch(error){
    console.log("PLAID ERROR:");
    console.log(error.response?.data || error.message);

    return error.message;
  }
}

const getBalances = async(userId, plaidItemID)=>{
  try{
    const accessToken = await plaidUtils.getAccessToken(userId, plaidItemID);
    const institutionDetails = await institutionInfo(accessToken);
    const response = await plaidUtils.client.accountsBalanceGet({
      access_token: accessToken,
    });
    const itemResponse = await plaidUtils.client.itemGet({
      access_token: accessToken,
    });
    const institutionId = itemResponse.data.item.institution_id;
    const accounts = response.data.accounts;
    // const existingAccountsData = await AccountModel.find({plaidItemId: itemID});
    // if(!existingAccountsData){
    //   await AccountModel.create({
    //     userId,
    //     plaidItemId: itemID,
    //     officialName: institutionDetails,

    //     accounts: accounts.map((account) => ({
    //       accountId: account.account_id,
    //       name: account.name,
    //       type: account.type,
    //       subtype: account.subtype,
    //       mask: account.mask,
    //       balances: {
    //         available: account.balances.available,
    //         current: account.balances.current,
    //         limit: account.balances.limit,
    //         currency: account.balances.iso_currency_code,
    //       },
    //       persistentAccountId: account.persistent_account_id,
    //     })),
    //   });
    // }
    // for (const account of accounts) {
    //   const duplicate = await AccountModel.findOne({
    //     userId,
    //     officialName: institutionDetails,
    //     accounts: {
    //       $elemMatch: {
    //         mask: account.mask,
    //         subtype: account.subtype,
    //         type: account.type,
    //         name: account.name,
    //         isActive: true
    //       }
    //     }
    //   });

    //   if (duplicate) {
    //     return `${account.name} already connected`
    //   }
    // }
    let existingBank = await AccountModel.findOne({userId,institutionId}).select("+items.encryptedAccessToken");
    if (!existingBank) {
      await AccountModel.create({
        userId,
        plaidItemId: plaidItemID, 
        institutionId, 
        officialName:institutionDetails,
        items: [ 
          { 
            plaidItemId: plaidItemID, 
            encryptedAccessToken: plaidUtils.encrypt( accessToken )
          }
        ],
        accounts: 
          accounts.map((account) => ({
            plaidItemId: plaidItemID,
            accountId: account.account_id,
            name: account.name,
            type: account.type,
            subtype: account.subtype,
            mask: account.mask,
            balances: {
              available: account.balances.available,
              current: account.balances.current,
              limit: account.balances.limit,
              currency: account.balances.iso_currency_code,
            },
            persistentAccountId: account.persistent_account_id,
          }))
      });
    }
    return accounts;
    
  }catch(error){
    console.log("PLAID ERROR:");
    console.log(error.response?.data || error.message);

    return error.message;
  }
}

router.post("/addBudget", async (req,res)=>{
  const { category, amount, month } = req.body.formData;
  const userId  = req.body.userId;
  let enteredMonth = '';
  let enteredYear = ''
  try{
    if(!userId)
      return res.status(400).json({"success": false, "message": "Bad Netwrok Request"})
    if(month){
      enteredMonth = month.split("-")[1];
      enteredYear = month.split("-")[0]
    }
    if(!category || !amount)
      return res.status(400).json({"success": false, "message": "Bad Network Call"})
    const AddedBudget = await BudgetModel.findOneAndUpdate(
      {
        userId
      },
      {
        userId,
        $push:{
          budgets:{
            category: category,
            limit: amount,
            month: enteredMonth,
            year: enteredYear,
          }
        }
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    )
    return res.status(200).json({ success: true , message: "Balance Data Added successfully", budegts: AddedBudget});

  } catch (error) {
    return res.status(500).json({"succes": false, "message": error.response?.data || error.message})
  }
});

router.post("/getBudget", async(req,res) => {
  const userId = req.body.userId;
  try{
    if(!userId) 
      return res.status(400).json({"success": false, "message": "Bad Network Call"})
      const budgetData = await BudgetModel.find({userId: userId});
      if(budgetData)
        return res.status(200).json({"success": true, "message": "Records found", data: budgetData});
  } catch (error){
    return res.status(500).json({"success": false, "message": error.response?.data || error.message})
  }
});

router.post("/income-expense-chart", async(req,res)=>{
  const userId = req.body.userId
  try{
    const data = await TransactionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $unwind: "$transactions"
    },
    {
      $group: {
        _id: {
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: "$transactions.date"
            }
          },
          category: {
            $ifNull: [
              "$transactions.merchantName",
              "$transactions.name"
            ]
          }
        },

        income: {
          $sum: {
            $cond: [
              { $lt: ["$transactions.amount", 0] },
              { $abs: "$transactions.amount" },
              0
            ]
          }
        },

        expense: {
          $sum: {
            $cond: [
              { $gt: ["$transactions.amount", 0] },
              "$transactions.amount",
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        category: "$_id.category",
        income: 1,
        expense: 1
      }
    },
    {
      $sort: {
        month: 1,
        category: 1
      }
    }
  ]);
    return res.status(200).json({"success":true,"data":data});
  }catch(err){
    return res.status(500).json({"success":false, "message":err.message})
  }
});
module.exports = router;
