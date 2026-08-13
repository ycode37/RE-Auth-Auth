import express from "express";
import {
  logoutUser,
  myProfile,
  refreshToken,
  registerUser,
  verifyOtp,
} from "../controllers/user.controller.js";
import { verifyUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const Router = express.Router();
Router.post("/register", registerUser);
Router.post("/verify/:token", verifyUser); // Add the verify email route
Router.post("/login", loginUser);
Router.post("/verify-otp", verifyOtp); // Add the verify OTP route
Router.get("/profile", isAuth, myProfile); // Add the my profile route
Router.post("/refresh", refreshToken);
Router.post("/logout", isAuth, logoutUser);
export default Router;
