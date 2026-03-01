import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "https://placehold.co/600x400",
        localPath: "",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // normalize
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    skills: {
      type: [String],
      default: [],
    },
    isUserVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    emailVerificationOTP: {
      type: String,
      select: false,
    },
    emailVerificationOTPExpiry: {
      type: Date,
    },
    emailVerificationOTPAttempts: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
