import bycrypt from "bcrypt";
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

    // Hash the password
    const hashedPassword = await bycrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      skills,
    });

    const otp = crypto.randomInt(10000, 99999).toString();
    const otpExpiry = Date.now() + 15 * 60 * 1000;
    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpiry = otpExpiry;

    //fire inngest event
    await inngest.send({
      name: "user-signup",
      data: {
        email,
        otp,
      },
    });

    await user.save();
    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        name: user.name,
        email: user.email,
        skills: user.skills,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bycrypt.compare(password, user.password);
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
      httpOnly: true,
      secure: true,
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
    return res.status(500).json({ message: "Internal server error" });
  }
}


export const logoutUser = async (req, res) => {
try {
      const user = req.user;
    
      res.cookie("refresh_token", "", {
        expires: new Date(0),
      });
    
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    
      res.status(200).json(new ApiResponse(200, "user logged out succesfully"));
} catch (error) {
  console.error("Error logging out user:", error);
  res.status(500).json(new ApiResponse(500, "Error logging out user"));
}
};


export const updateUser = async (req, res) => {
  try {
    const {skills =[] , role, email} = req.body;
    if (req.user.role!=="admin") {
      return res.status(403).json({
        message: "Forbidden: Only admin can update user details",
        success: false
      })
    }

    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: No user found with the provided email",
        success: false
      })
    }

     await User.updateOne({
      email,
      $set: { skills: skills.length ? skills : user.skills }
     })
    
  } catch (error) {
    return res.status(500).json({
      message: "Server Error while updating user details",
      success: false,
      error: error.message
    })
  }
}

export const getUsers = async (req, res) => {
  try {
    if (req.user.role!=="admin") {
      return res.status(403).json({
        message: "Forbidden: Only admin can access user details",
        success: false
      })
    }
   const users = await User.find().select("-password")
    return res.status(200).json({
        message: "Users fetched successfully",
        success: true,
        users
      })
   
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching users",
      success: false,
      error: error.message
    })
  }
}