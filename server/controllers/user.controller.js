import tryCatch from "../middlewares/trycatch.js";
import sanitize from "mongo-sanitize";
import { registerUserSchema } from "../config/zod.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { unknown } from "zod";
import { redisClient } from "../index.js";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
import { getVerifyEmailHtml } from "../config/html.js";

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
