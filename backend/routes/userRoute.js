import express from "express";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { User } from "../model/userSchema.js";
import { OTP } from "../model/otpSchema.js";
import { authenticateToken } from "../middleware/auth.js";
import { Profile } from "../model/profileSchema.js";

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExistByUsername = await User.findOne({ username });
    if (userExistByUsername) {
      return res.status(400).send({
        message: "Username already exists",
      });
    }

    const userExistByEmail = await User.findOne({ email });
    if (userExistByEmail) {
      return res.status(400).send({
        message: "Email already exists",
      });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    await OTP.create({ email, otp });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for verification is: ${otp}`,
    });

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    res.status(201).send({
      message: "Successfully Signed Up",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error in Signing Up, Please Try Later",
    });
  }
});

// OTP verification route
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (otpRecord) {
      const user = await User.findOne({ email, isVerified: false });
      if (!user) {
        return res
          .status(400)
          .send({ message: "User not found or already verified" });
      }

      // Mark the user as verified
      user.isVerified = true;
      await user.save();

      await OTP.deleteOne({ email, otp });

      const token = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).send({
        message: "OTP verified successfully. User registered.",
        token,
      });
    } else {
      await User.deleteOne({ email, isVerified: false });
      res
        .status(400)
        .send({ message: "Invalid OTP. User registration cancelled." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error verifying OTP" });
  }
});

// Signin route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "User does not exist" });
    }

    if (!user.isVerified) {
      return res.status(403).send({
        message: "Email not verified. Please verify your email first.",
      });
    }

    if (user.password != password) {
      return res.status(400).send({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).send({
      message: "Logged in Successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error in logging in" });
  }
});

//Added Profile data
router.post("/data", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const { location, age, work, DateOfBirth, description } = req.body;
  try {
    const profileData = new Profile({
      location,
      age,
      work,
      DateOfBirth,
      description,
      userId: id,
    });

    await profileData.save();

    res.status(200).send({
      message: "data added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "error in adding data",
    });
  }
});

//updating User data
router.put("/update", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const data = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    Object.keys(data).forEach((key) => {
      user[key] = data[key];
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in Updating User Profile",
    });
  }
});

//getting user info
router.get("/info", authenticateToken, async (req, res) => {
  const { id } = req.user;
  try {
    const data = await Profile.findOne({ userId: id });
    res.status(200).send({
      message: "Data Retrived Successfully",
      data,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error in Retrieving data",
    });
  }
});

export default router;
