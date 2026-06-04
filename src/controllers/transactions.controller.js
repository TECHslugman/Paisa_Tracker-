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