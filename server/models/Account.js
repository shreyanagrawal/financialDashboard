const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
  plaidItemId: {type: String,required: true},
  officialName: String,
  accounts:[
    {
      accountId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      subtype: String,
      mask: String,
      balances: {
        available: Number,
        current: Number,
        limit: Number,
        currency: String,
      },
      persistentAccountId: String,
      isActive:{
        type: Boolean,
        default: true
      },
      disconnectedAt:{
        type: Date,
        default: null
      }
    }
  ],
  createdAt: {type: Date,default: Date.now},
  updatedAt: {type: Date,default: Date.now},
});
AccountSchema.index(
  { plaidItemId: 1, "accounts.accountId": 1 },
  { unique: true }
);
const AccountModel = mongoose.model("Account",AccountSchema);
module.exports = AccountModel;