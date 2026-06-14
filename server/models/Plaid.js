const mongoose = require("mongoose");

const PlaidSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    plaidItemId: String,
    encryptedAccessToken: {
        type: String,
        select: false,
    },
    createdAt:{type: Date, default: Date.now}
})

const PlaidModel = mongoose.model("PlaidItem",PlaidSchema)
module.exports = PlaidModel;