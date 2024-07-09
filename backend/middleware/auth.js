import { User } from "../model/userSchema.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);

    req.username = verified.username;
    req.user = { id: verified.id, username: verified.username };
    next();
  } catch (err) {
    res.status(400).send({ message: "Invalid Token" });
  }
};

export function generateNumericOTP(length) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}
