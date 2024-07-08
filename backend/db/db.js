import mongoose from "mongoose";
import "dotenv/config";
export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("database is connected");
  } catch (err) {
    console.log(err);
  }
}
