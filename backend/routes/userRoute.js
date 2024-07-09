import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "../model/userSchema.js";
import { OTP } from "../model/otpSchema.js";
import { authenticateToken, generateNumericOTP } from "../middleware/auth.js";
import { Profile } from "../model/profileSchema.js";

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExistByUsername = await User.findOne({ username });
    if (userExistByUsername) {
      return res
        .status(400)
        .send({ message: "Username already exists", success: false });
    }

    const userExistByEmail = await User.findOne({ email });
    if (userExistByEmail) {
      return res
        .status(400)
        .send({ message: "Email already exists", success: false });
    }

    // Generate OTP
    const otp = generateNumericOTP(6);
    // Save OTP to OTP collection
    await OTP.create({ email, otp });

    // Send OTP via email (using nodemailer or any other email service)
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

    // Create new user
    const newUser = new User({ username, email, password });

    // Save user to database
    await newUser.save();

    res.status(201).send({ message: "Successfully Signed Up", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error in Signing Up, Please Try Later",
      success: false,
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (otpRecord) {
      const user = await User.findOne({ email, isVerified: false });
      if (!user) {
        return res.status(400).send({
          message: "User not found or already verified",
          success: false,
        });
      }

      // Mark the user as verified
      user.isVerified = true;
      await user.save();

      // Delete OTP record from OTP collection
      await OTP.deleteOne({ email, otp });

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).send({
        message: "OTP verified successfully. User registered.",
        token,
        success: true,
      });
    } else {
      // If OTP fails, delete user
      await User.deleteOne({ email, isVerified: false });
      res.status(400).send({
        message: "Invalid OTP. User registration cancelled.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error verifying OTP", success: false });
  }
});

// Resend OTP route
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user already exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    // Generate new OTP
    const otp = generateNumericOTP(6);
    // Update OTP in OTP collection
    await OTP.findOneAndUpdate({ email }, { otp });

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
      subject: "OTP Resent",
      text: `Your OTP for verification is: ${otp}`,
    });

    res.status(200).send({ message: "OTP resent successfully", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error resending OTP", success: false });
  }
});

// Signin route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "User does not exist", success: false });
    }

    if (!user.isVerified) {
      return res.status(403).send({
        message: "Email not verified. Please verify your email first.",
        success: false,
      });
    }

    if (user.password !== password) {
      return res
        .status(400)
        .send({ message: "Invalid password", success: false });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).send({
      message: "Logged in Successfully",
      token,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error in logging in", success: false });
  }
});

router.post("/data", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const { location, age, work, dob, description } = req.body;
  try {
    console.log(id);
    const profileData = new Profile({
      location,
      age,
      work,
      DateOfBirth: new Date(dob),
      description,
      userId: id,
    });

    const savedProfile = await profileData.save();

    console.log("Saving profile data:", savedProfile);
    res.status(200).send({
      message: "Data added successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error in saving profile data:", err);
    res.status(500).send({
      message: "Error in adding data",
      success: false,
    });
  }
});

// Updating User data
router.put("/update", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const data = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    Object.keys(data).forEach((key) => {
      user[key] = data[key];
    });

    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error in updating user profile",
      success: false,
    });
  }
});

// Getting user info
router.get("/info", authenticateToken, async (req, res) => {
  const { id } = req.user;
  try {
    const data = await Profile.findOne({ userId: id });
    if (!data) {
      return res.status(404).json({
        message: "User data not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User data retrieved successfully",
      data,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error in retrieving user data",
      success: false,
    });
  }
});

export default router;
