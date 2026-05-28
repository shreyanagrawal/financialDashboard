const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
    plaidItemId: {type: String,required: true},
    transactions:[
        {
            accountId: {type: String,required: true},
            transactionId: {type: String,required: true,unique: true},
            name: {type: String,required: true},
            amount: {type: Number,required: true},
            category: [String],
            merchantName: String,
            date: {type: Date,required: true},
            pending: {type: Boolean,default: false},
        }
    ]
    },
    {timestamps: true}
);
const TransactionModel = mongoose.model("Transaction",TransactionSchema);
module.exports = TransactionModel;