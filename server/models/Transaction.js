const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
    items:[
        {
            plaidItemId: {type: String,required: true},
            institutionId: {type: String, required: true},
            institutionName: {type: String, required: true}
        }
    ],
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
    ], 
    manualTransactions:[
        {
            type: {
                type: String,
                enum: ["income", "expense"],
                required: true,
            },
            merchant: {
                type: String,
                required: true,
                trim: true,
            },
            amount: {
                type: Number,
                required: true,
                min: 0,
            },
            category: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        },
    ],
    
    },
    {timestamps: true}
);
const TransactionModel = mongoose.model("Transaction",TransactionSchema);
module.exports = TransactionModel;