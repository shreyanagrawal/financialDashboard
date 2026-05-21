const router = require("express").Router();
const {plaidCookieConfig} = require("../utils/cookieConfig");
const plaidUtils = require("../utils/plaidUtils");
const PlaidItem = require("../models/Plaid");
const Accounts = require("../models/Account");
const Account = require("../models/Account");

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
  try {
    const tokenResponse = await plaidUtils.client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    
    const accessToken = tokenResponse.data.access_token;
    const itemID = tokenResponse.data.item_id;
    const institutionDetails = await institutionInfo(accessToken);
    const encryptedAcessToken = plaidUtils.encrypt(accessToken);
    await PlaidItem.create({
      userId: req.body.user_id,
      plaidItemId: itemID,
      encryptedAccessToken: encryptedAcessToken,
      institutionName: institutionDetails
    });
    // res.clearCookie("plaidToken");
    res.json({ success: true , message: "Bank Connected Succesfully" });
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
  return institutionResponse.data.institution.name;
};

router.post("/balances", async(req,res) => {
  try{
    const userId = req.body.user_id;
    const accessToken = await plaidUtils.getAccessToken(userId);
    const institutionDetails = await institutionInfo(accessToken);
    const response = await plaidUtils.client.accountsBalanceGet({
      access_token: accessToken,
    });
    const itemResponse = await plaidUtils.client.itemGet({
      access_token: accessToken,
    });
    const itemID = itemResponse.data.item.item_id;
    const accounts = response.data.accounts;


    await Account.create({
      userId,
      plaidItemId: itemID,
      officialName: institutionDetails,

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
    });

    // const accountsData = await new Account(accounts).save();

    res.json({
      success: true,
      accounts
    });

  }catch(error){
    console.log("PLAID ERROR:");
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: true,
      message:
        error.response?.data?.error_message ||
        error.message
    });
  }
});

module.exports = router;
