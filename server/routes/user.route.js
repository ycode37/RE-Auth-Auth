import express from "express";
import { registerUser, verifyOtp } from "../controllers/user.controller.js";
import { verifyUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";


const Router = express.Router();
Router.post("/register", registerUser);
Router.post("/verify/:token", verifyUser); // Add the verify email route
Router.post("/login", loginUser);
Router.post("/verify-otp", verifyOtp); // Add the verify OTP route
export default Router;
