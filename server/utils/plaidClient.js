require("dotenv").config();
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
console.log(process.env.PLAID_CLIENT_ID);
console.log(process.env.PLAID_SECRET);
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

module.exports = client;
