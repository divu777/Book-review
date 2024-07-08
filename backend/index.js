import e from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import bookRoute from "./routes/bookRoute.js";
import "dotenv/config";
import connectDB from "./db/db.js";
const app = e();

app.use(e.json());
app.use(cors());

connectDB();

app.use("/api/v1/user", userRoute);
app.use("/api/v1/book", bookRoute);
app.listen(process.env.PORT, () => {
  console.log(`system is running on port ${process.env.PORT}`);
});
