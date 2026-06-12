const router = require("express").Router();
const ManualTransactionModel = require("../models/ManualTransaction");

// to store data in db
router.post("/", async (req, res) => {
  try {
    const { userId, type, merchant, amount, category, date } = req.body;
    if (!userId || !type || !merchant || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }
    const transaction = await ManualTransactionModel.create({
      userId,
      type,
      merchant: merchant.trim(),
      amount,
      category,
      date,
    });
    res.status(201).json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// to get data from db
router.get("/:userId", async (req, res) => {
  try {
    const transactions = await ManualTransactionModel.find({
      userId: req.params.userId,
    }).sort({
      date: -1,
    });
    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// to update data in db
router.put("/:id", async (req, res) => {
  try {
    const updatedTransaction = await ManualTransactionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }
    res.json({
      success: true,
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// to delete data in db
router.delete("/:id", async (req, res) => {
  try {
    const deletedTransaction = await ManualTransactionModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }
    res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;