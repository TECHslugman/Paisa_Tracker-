const Transaction = require('../models/transaction.model');

exports.createTransaction = async (req, res) => {
  try {
    // We get req.user.id from the authMiddleware
    const { 
      raw_sms, type, amount, currency, reference_id, 
      timestamp, account_last4, balance_after, merchant, category, source 
    } = req.body;

    const newTransaction = await Transaction.create({
      user: req.user.id, // Linking the transaction to the user 
      raw_sms,
      type,
      amount,
      currency,
      reference_id,
      timestamp,
      account_last4,
      balance_after,
      merchant,
      category,
      source
    });

    res.status(201).json({ 
      message: "Transaction added successfully", 
      transaction: newTransaction 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getTransactions = async (req, res) => {
  try {
    console.log("DEBUG user id:", req.user?.id);
    const transactions = await Transaction.find({ 
      user: req.user.id }).sort({ timestamp: -1 });
    console.log("DEBUG transactions found:", transactions.length);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params; // The ID of the transaction to delete
    
    //  delete the transaction ONLY IF it belongs to the logged-in user
    const deleted = await Transaction.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found or unauthorized" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    // update the fields provided in req.body
    const updated = await Transaction.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: req.body },
      { new: true } 
    );

    if (!updated) {
      return res.status(404).json({ error: "Transaction not found or unauthorized" });
    }

    res.json({ message: "Transaction updated successfully", transaction: updated });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ _id: id, user: req.user.id });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};