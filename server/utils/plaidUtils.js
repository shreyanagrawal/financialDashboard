require("dotenv").config();
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const PlaidItem = require("../models/Plaid");

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});
const client = new PlaidApi(configuration);

const ekey = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY)
  .digest();
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        algorithm,
        ekey,
        iv
    );
    let encrypted = cipher.update(
        text,
        "utf8",
        "hex"
    );
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

const dkey = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY)
    .digest();

function decrypt(encryptedText){
    const [ivHex, encryptedData] = encryptedText.split(":");

    if(!ivHex || !encryptedData){
        throw new Error("Invalid encrypted text format!!");
    }

    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
        algorithm,
        dkey,
        iv
    );

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

const getAccessToken = async(userId, plaidItemId) => {
    const plaidDoc = await PlaidItem.findOne({ userId }).select("+encryptedAccessToken");
    if(!plaidDoc){
          throw new Error("Document not found");
    }
    return decrypt(plaidDoc.encryptedAccessToken);
};
const createUpdateModeLinkToken = async(userId, accessToken) => {
    try {
        const response = await client.linkTokenCreate({
            user: {
                client_user_id: userId.toString()
            },
            client_name: "PFM Dashboard",
            products: ["transactions"],
            country_codes: ["US"],
            language: "en",
            access_token: accessToken,
            update: {
                account_selection_enabled: true
            }
        });
        return response.data.link_token;
    } catch (error) {
        throw new Error(`Failed to create update mode link token: ${error.message}`);
    }
};
module.exports = {client,encrypt,decrypt,getAccessToken,createUpdateModeLinkToken}