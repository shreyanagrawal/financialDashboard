const mongoose = require("mongoose");

const PlaidSchema = new mongoose.Schema({
    userTd:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    plaidItemId: String,
    encryptedAccessToken: {
        type: String,
        select: false,
    },
    institutionName: String,
    createdAt:{type: Date, default: Date.now}
})

const PlaidModel = mongoose.model("PlaidItem",PlaidSchema)
module.exports = PlaidModel;