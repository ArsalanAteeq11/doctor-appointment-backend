import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  profilePhoto: { type: String, default: "" },
  specialty: { type: String },
  education: { type: String },
  address: {
    addressLine1: { type: String },
    addressLine2: { type: String },
  },
  experience: { type: Number },
  fees: { type: Number },
  about: { type: String },

  // New fields
  gender: { type: String }, // Gender field
  dob: { type: Date }, // Date of birth field
  phone: { type: String }, // Phone number field
  language:{type:String},

  otp: { type: String }, // Store the OTP
  otpExpires: { type: Date }, // Store when the OTP expires
  isVerified: { type: Boolean, default: false },
});

export const User = mongoose.model("User", userSchema);
