const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
    raw_sms: { 
      type: String, 
      
    },

    type: { 
      type: String, 
      enum: ["debit", "credit"], 
     
    },

    amount: { 
      type: Number, 
      
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
      
    },

    account_last4: { 
      type: String, 
     
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
    },

  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
