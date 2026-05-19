const router = require("express").Router();
const plaidCookieConfig = require("../utils/plaidCookieConfig");
const client = require("../utils/plaidClient");
const encrypt = require("../utils/encrypt");
const decrypt = require("../utils/decrypt");
const PlaidItem = require("../models/Plaid");
const getAccessToken = require("../utils/getAccessToken");

router.post("/create-link-token", async (req, res) => {
  try {
    const response = await client.linkTokenCreate({
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
  console.log(req.user)
  const publicToken = req.body.public_token;
  try {
    const tokenResponse = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    const accessToken = tokenResponse.data.access_token;
    const itemID = tokenResponse.data.item_id;
    const institutionDetails = await institutionInfo(accessToken);
    const encryptedAcessToken = encrypt(accessToken);
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

router.post('/auth', async function (req, res) {
  try {
    const userId = req.body.user_id;

    const accessToken = await getAccessToken(userId); 
    
    //Very very importnat  {Use decrypted token in Plaid API}
    const accountResponse = await client.authGet({
      access_token: accessToken,
    })

    res.json(accountResponse.data);

  } catch (error) {

  console.log("PLAID ERROR:");
  console.log(error.response?.data || error.message);

  res.status(500).json({
    error: true,
    message:
      error.response?.data?.error_message ||
      error.message,
    
    error_code:
      error.response?.data?.error_code,

    error_type:
      error.response?.data?.error_type,
  });
}
});

const institutionInfo = async (accessToken) => {
  const itemResponse = await client.itemGet({
      access_token: accessToken,
  });
  const institutionId = itemResponse.data.item.institution_id;
  // console.log(institutionId);
  const institutionResponse = await client.institutionsGetById({
    institution_id: institutionId,
    country_codes: ["US"],
  });
  return institutionResponse.data.institution.name;
};

router.post("/balances", async(req,res) => {
  try{
    const userId = req.body.user_id;

    const accessToken = await getAccessToken(userId);

    const response = await client.accountsBalanceGet({
      access_token: accessToken,
    });

    const accounts = response.data.accounts.map(account => ({
      id: account.account_id,
      name: account.name,
      type: account.type,
       subtype: account.subtype,
      mask: account.mask,
      availableBalance: account.balances.available,
      currentBalance: account.balances.current,
      currency: account.balances.iso_currency_code
    }));

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
