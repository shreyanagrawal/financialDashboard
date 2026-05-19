//helper function
const PlaidItem = require("../models/Plaid");
const decrypt = require("./decrypt");

const getAccessToken = async(userId) => {

    const plaidItem = await PlaidItem
        .findOne({ userId })
        .select("+encryptedAccessToken");

    if(!plaidItem){
          throw new Error("Plaid item not found");
    }

    const decryptedToken = decrypt(
        plaidItem.encryptedAccessToken
    );

    return decryptedToken;
};

module.exports = getAccessToken;