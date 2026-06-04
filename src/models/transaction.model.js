const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    raw_sms: { 
      type: String, 
      required: true 
    },

    type: { 
      type: String, 
      enum: ["debit", "credit"], 
      required: true 
    },

    amount: { 
      type: Number, 
      required: true 
    },

    currency: { 
      type: String, 
      default: "BTN" 
    },

    reference_id: { 
      type: String, 
      required: true, 
      unique: true 
    },

    timestamp: { 
      type: Date, 
      required: true 
    },

    account_last4: { 
      type: String, 
      required: true 
    },

    balance_after: { 
      type: Number 
    },

    merchant: { 
      type: String 
    },

    category: { 
      type: String 
    },

    source: { 
      type: String, 
      enum: ["mpay_sms", "manual"], 
      required: true 
    },

  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
