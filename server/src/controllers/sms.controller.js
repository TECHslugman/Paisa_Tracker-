const Transaction = require('../models/transaction.model');
const { parseBNBSms } = require('../utils/smsParser');

const SMS_SECRET = process.env.SMS_SECRET || 'paisa_tracker_sms_2026';
const ALLOWED_SENDERS = ['BNB', 'BNBL', 'B-BNB'];  // adjust if needed

exports.receiveSMS = async (req, res) => {
  try {
    const { message, sender, secret, userId } = req.body;

    if (secret !== SMS_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!ALLOWED_SENDERS.some(s => sender?.includes(s))) {
      return res.status(400).json({ error: 'Sender not whitelisted' });
    }

    const parsed = parseBNBSms(message);

    if (!parsed.amount) {
      return res.status(422).json({ error: 'Could not parse amount' });
    }

    // Duplicate guard
    const existing = await Transaction.findOne({ reference_id: parsed.reference_id });
    if (existing) {
      return res.status(200).json({ message: 'Already recorded', transaction: existing });
    }

    const transaction = await Transaction.create({
      user: userId,
      ...parsed,
    });

    res.status(201).json({ message: 'Transaction recorded', transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};
