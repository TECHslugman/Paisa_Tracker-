const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  
  name: { 
    type: String, 
    required: false 
  },
  number: {
    type:String,
    required: true
  }

}, { timestamps: true });

// hashing before data hits the DB
userSchema.pre('save', async function() {
  // Only hash if the password was modified (or if it's a new user)
  if (!this.isModified('password')) return;
  
  // Hash the password with a salt round of 10
  this.password = await bcrypt.hash(this.password, 10);
});

// Helper method to compare passwords 
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);