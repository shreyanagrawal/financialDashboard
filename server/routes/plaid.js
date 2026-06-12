const router = require("express").Router();
const {plaidCookieConfig} = require("../utils/cookieConfig");
const plaidUtils = require("../utils/plaidUtils");
const PlaidItem = require("../models/Plaid");
const AccountModel = require("../models/Account");
const TransactionModel = require("../models/Transaction");

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
      { userId },
      {
        userId,
        $push: {
          items: {
            plaidItemId: itemID,
            encryptedAccessToken: encryptedAcessToken,
            institutionName: institutionDetails.name,
            institutionId: institutionDetails.id
          }
        },
        $set: { updatedAt: new Date() }
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

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

const institutionInfo = async (accessToken) => {
  const itemResponse = await plaidUtils.client.itemGet({
      access_token: accessToken,
  });
  const institutionId = itemResponse.data.item.institution_id;
  const institutionResponse = await plaidUtils.client.institutionsGetById({
    institution_id: institutionId,
    country_codes: ["US"],
  });
  return {
    id: institutionId,
    name: institutionResponse.data.institution.name
  };
};

const getTransactions = async(userId, plaidItemId)=>{
  try{
    const tokenData = await plaidUtils.getAccessTokenByPlaidItemId(userId, plaidItemId);
    const accessToken = tokenData.accessToken;
    const response = await plaidUtils.client.transactionsGet({
      access_token: accessToken,
      start_date: "2024-01-01",
      end_date: new Date().toISOString().split("T")[0],
    });
    const transactions = response.data.transactions;
    await TransactionModel.updateOne(
      {
        userId,
        plaidItemId: plaidItemId,
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
          plaidItemId: plaidItemId,
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
const getBalances = async(userId, plaidItemId)=>{
  try{
    const tokenData = await plaidUtils.getAccessTokenByPlaidItemId(userId, plaidItemId);
    const accessToken = tokenData.accessToken;
    const institutionName = tokenData.institutionName;
    const response = await plaidUtils.client.accountsBalanceGet({
      access_token: accessToken,
    });
    const accounts = response.data.accounts;

    for (const account of accounts) {
      const duplicate = await AccountModel.findOne({
        userId,
        plaidItemId: plaidItemId,
        accounts: {
          $elemMatch: {
            accountId: account.account_id
          }
        }
      });

      if (duplicate) {
        return `${account.name} already connected`
      }
    }

    await AccountModel.findOneAndUpdate(
      {
        userId,
        plaidItemId: plaidItemId,
      },
      {
        userId,
        plaidItemId: plaidItemId,
        officialName: institutionName,
        accounts: accounts.map((account) => ({
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
        })),
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );
    return accounts;
  }catch(error){
    console.log("PLAID ERROR:");
    console.log(error.response?.data || error.message);

    return error.message;
  }
}

router.post('/link-token/update', async (req, res) => {
  try {
    const { userId, plaidItemId } = req.body;

    if (!userId || !plaidItemId) {
      return res.status(400).json({
        error: true,
        message: 'userId and plaidItemId are required'
      });
    }

    const tokenData = await plaidUtils.getAccessTokenByPlaidItemId(userId, plaidItemId);
    const linkToken = await plaidUtils.createUpdateModeLinkToken(userId, tokenData.accessToken);

    res.json({
      link_token: linkToken,
      institutionName: tokenData.institutionName
    });

  } catch (error) {
    console.log("PLAID ERROR:");
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
      return res.status(400).json({
        error: true,
        message: 'userId and plaidItemId are required'
      });
    }

    const tokenData = await plaidUtils.getAccessTokenByPlaidItemId(userId, plaidItemId);
    const accessToken = tokenData.accessToken;

    const accountsResponse = await plaidUtils.client.accountsGet({
      access_token: accessToken,
    });

    const plaidAccounts = accountsResponse.data.accounts;

    const syncResult = await syncAccountsAfterUpdate(userId, plaidItemId, plaidAccounts, tokenData.institutionName);

    res.json({
      success: true,
      newAccountsAdded: syncResult.newAccountsAdded,
      existingAccountsPreserved: syncResult.existingAccountsPreserved,
      newAccounts: syncResult.newAccounts,
      existingAccounts: syncResult.existingAccounts,
      syncedAt: new Date()
    });

  } catch (error) {
    console.log("PLAID ERROR:");
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

const syncAccountsAfterUpdate = async (userId, plaidItemId, plaidAccounts, institutionName) => {
  const storedAccount = await AccountModel.findOne({
    userId,
    plaidItemId
  });

  if (!storedAccount) {
    const newAccounts = plaidAccounts.map(account => ({
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
      officialName: institutionName,
      accounts: newAccounts
    });

    return {
      newAccountsAdded: newAccounts.length,
      existingAccountsPreserved: 0,
      newAccounts,
      existingAccounts: []
    };
  }

  const existingAccountIds = storedAccount.accounts.map(a => a.accountId);

  const newAccountsData = plaidAccounts.filter(
    account => !existingAccountIds.includes(account.account_id)
  );

  if (newAccountsData.length > 0) {
    await AccountModel.updateOne(
      { userId, plaidItemId },
      {
        $push: {
          accounts: {
            $each: newAccountsData.map(account => ({
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
          }
        },
        $set: { updatedAt: new Date() }
      }
    );
  }

  return {
    newAccountsAdded: newAccountsData.length,
    existingAccountsPreserved: existingAccountIds.length,
    newAccounts: newAccountsData,
    existingAccounts: storedAccount.accounts
  };
};

module.exports = router;
