const mongoose = require("mongoose");
const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    budgets:[{
        category: {type: String,  required: true, default:"Other"},
        limit: {type: Number, required: true},
        month: {type: Number, required: true},
        year: {type: Number, required: true},
        createdAt: {type: Date,default: Date.now}
    }],
    },
    {
        timestamps: true
    }
);
const BudgetModel = mongoose.model("Budget",BudgetSchema)
module.exports = BudgetModel;
