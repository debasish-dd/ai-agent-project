import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { inngest } from "../inngest/client.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  try {
    const { name, email, password, skills = [] } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      skills,
    });

    const otp = crypto.randomInt(10000, 99999).toString();
    user.emailVerificationOTP = await bcrypt.hash(otp, 10);

    const otpExpiry = Date.now() + 15 * 60 * 1000;
    user.emailVerificationOTPExpiry = otpExpiry;

    //fire inngest event
    await inngest.send({
      name: "user-signup",
      data: {
        email,
        otp,
      },
    });

    // saving the user
    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        name: user.name,
        email: user.email,
        skills: user.skills,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while signing up user" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const user = await User.findOne({ email }).select("+emailVerificationOTP");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isUserVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    if (user.emailVerificationOTPExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    const isOtpValid = await bcrypt.compare(otp, user.emailVerificationOTP);
    if (!isOtpValid) {
      user.emailVerificationOTPAttempts += 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isUserVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpiry = undefined;
    user.emailVerificationOTPAttempts = 0;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "User verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials , user not available" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("refresh_token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        skills: user.skills,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      message: "Internal server error while loging in the user",
      error,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userID = req.user?.id;
    const user = await User.findById(userID);
    res.cookie("refresh_token", "", {
      expires: new Date(0),
    });

    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ message: "user logged out succesfully", success: true });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Error logging out user", success: false });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { skills = [], role, email } = req.body;
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Only admin can update user details",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: No user found with the provided email",
        success: false,
      });
    }

    await User.updateOne(
      { email },
      {
        $set: {
          skills: skills.length ? skills : user.skills,
          role: role.length ? role : user.role,
        },
      },
    );
    return res.status(200).json({
      message: "user profile updated succesfully",
      success: true,
      user: {
        role: user.role,
        skills: user.skills,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error while updating user details",
      success: false,
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Only admin can access user details",
        success: false,
      });
    }

    const users = await User.find().select("-password");
    console.log("users->", users);

    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching users",
      success: false,
      error: error.message,
    });
  }
};

// export const getMe = async (req, res) => {
//   try {
//     const userID = req.user?.id;
//     const user = await User.findById(userID).select("-password");
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User not found", success: false });
//     }
//     return res.status(200).json({
//       message: "User details fetched successfully",
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     return res.status(500).json({
//       message: "Internal server error while fetching user details",
//       success: false,
//       error: error.message,
//     });
//   }
// };
