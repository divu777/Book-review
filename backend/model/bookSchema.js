import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    default: 0,
    required: true,
  },
  review: {
    type: String,
  },
});

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reviews: [ReviewSchema],
});

export const Book = new mongoose.model("Book", BookSchema);
