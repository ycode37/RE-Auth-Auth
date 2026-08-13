import tryCatch from "../middlewares/trycatch.js";
import sanitize from "mongo-sanitize";
import { loginUserSchema, registerUserSchema } from "../config/zod.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { unknown } from "zod";
import { redisClient } from "../index.js";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js";
import {
  generateAccesstoken,
  generateToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../config/generateToken.js";

export const registerUser = tryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  // performs validation without throwing an uncaught Javascript error if it fails.
  const validation = registerUserSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    const zodError = validation.error;
    let firstErrorMessage = "validation failed";
    let allErrorMessages = [];

    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allErrorMessages = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code || "invalid_type",
      }));
    }
    return res.status(400).json({
      message: "Validation failed",
      error: allErrorMessages,
    });
  }

  const { name, email, password } = validation.data;

  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many registration attempts. Please try again later.",
    });
  }

  const exisitingUser = await User.findOne({ email });

  const hashedPassword = await bcrypt.hash(password, 10);

  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyKey = `verify:${verifyToken}`;

  const datatoStore = JSON.stringify({
    name,
    email,
    password: hashedPassword,
  });

  await redisClient.set(verifyKey, datatoStore, { EX: 60 });

  const Subject = "Verify Your Email 4 Account Creation BOIII";

  const HTMl = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({ email, subject: Subject, html: HTMl });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  if (exisitingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  res.json({
    message:
      "User registered successfully. Please check your email to verify your account.",
  });
});

export const verifyUser = tryCatch(async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      message: "Verification token is required",
    });
  }
  const verifyKey = `verify:${token}`;
  const userData = await redisClient.get(verifyKey);

  if (!userData) {
    return res.status(400).json({
      message: "Invalid or expired verification token",
    });
  }
  await redisClient.del(verifyKey);

  const userDataJson = JSON.parse(userData);

  const exisitingUser = await User.findOne({ email: userDataJson.email });

  if (exisitingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
  const newUser = await User.create({
    name: userDataJson.name,
    email: userDataJson.email,
    password: userDataJson.password,
  });
  res.status(201).json({
    message: "User verified and created successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

export const loginUser = tryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  // performs validation without throwing an uncaught Javascript error if it fails.
  const validation = loginUserSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    const zodError = validation.error;
    let firstErrorMessage = "validation failed";
    let allErrorMessages = [];

    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allErrorMessages = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code || "invalid_type",
      }));
    }
    return res.status(400).json({
      message: "Validation failed",
      error: allErrorMessages,
    });
  }

  const { email, password } = validation.data;

  const loginRateLimitKey = `login-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(loginRateLimitKey)) {
    return res.status(429).json({
      message: "Too many login attempts. Please try again later.",
    });
  }

  const exisitingUser = await User.findOne({ email });

  if (!exisitingUser) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    exisitingUser.password,
  );

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, otp, { EX: 60 });

  const subject = "Your OTP for Login";
  const html = getOtpHtml({ email, otp });

  await sendMail({ email, subject, html });

  await redisClient.set(loginRateLimitKey, "true", { EX: 60 });

  res.json({
    message: "OTP sent to your email. Please verify within 60 seconds.",
  });
});

export const verifyOtp = tryCatch(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Email and OTP are required",
    });
  }
  const otpKey = `otp:${email}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp) {
    return res.status(400).json({
      message: "OTP has expired or is invalid",
    });
  }
  let parsedStoredOtp = storedOtp;
  try {
    parsedStoredOtp = JSON.parse(storedOtp);
  } catch {
    parsedStoredOtp = storedOtp;
  }

  if (String(parsedStoredOtp).trim() !== String(otp).trim()) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });

  const tokenData = await generateToken(user._id, res);

  res.status(200).json({
    message: `Welcome ${user.name}, you have successfully logged in.`,
    accessToken: tokenData.accessToken,
    refreshToken: tokenData.refreshToken,
  });
});

export const myProfile = tryCatch(async (req, res) => {
  const user = req.user;
  res.json(user);
});

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }
  const decoded = await verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
  await generateAccesstoken(decoded.id, res);

  res.status(200).json({ message: "Access token refreshed successfully" });
};

export const logoutUser = async (req, res) => {
  const userId = req.user._id;
  await revokeRefreshToken(userId);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};
