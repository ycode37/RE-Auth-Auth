import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";

export const generateToken = async (userId, res) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  await redisClient.setEx(refreshToken, 7 * 24 * 60 * 60, refreshToken); // Store refresh token in Redis with a 7-day expiration

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    // secure: true, // Ensure the cookie is sent over HTTPS
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 60 * 1000, // 1 minute
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    // secure: true, // Ensure the cookie is sent over HTTPS
    // sameSite: "strict", // Prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "none",
  });

  return { accessToken, refreshToken };
};
