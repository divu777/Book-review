import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, expires: "5m", default: Date.now },
});

export const OTP = mongoose.model("OTP", otpSchema);
