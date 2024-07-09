import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: Number,
  createdAt: { type: Date, expires: "5m", default: Date.now }, // Expires in 5 minutes
});

export const OTP = mongoose.model("OTP", otpSchema);
