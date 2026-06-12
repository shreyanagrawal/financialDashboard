const mongoose = require("mongoose");

const PlaidSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            plaidItemId: {
                type: String,
                required: true
            },
            encryptedAccessToken: {
                type: String,
                required: true,
                select: false,
            },
            institutionName: String,
            institutionId: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now}
});

PlaidSchema.index({ userId: 1, "items.plaidItemId": 1 }, { unique: true });

const PlaidModel = mongoose.model("PlaidItem",PlaidSchema)
module.exports = PlaidModel;