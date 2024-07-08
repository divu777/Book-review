import mongoose, { mongo } from "mongoose";

const ProfileSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  DateOfBirth: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

export const Profile = new mongoose.model("Profile", ProfileSchema);
