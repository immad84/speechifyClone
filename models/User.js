const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  password: { type: String, required: true, minlength: 6 },

  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Role", 
    required: true 
  },
  
  profilePicture: {
    type: String,
    default: "https://example.com/default-profile.jpg" // Default dummy URL
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);