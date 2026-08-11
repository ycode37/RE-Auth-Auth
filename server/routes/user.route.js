import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import { verifyUser } from "../controllers/user.controller.js";

const Router = express.Router();
Router.post("/register", registerUser);
Router.post("/verify/:token", verifyUser); // Add the verify email route

export default Router;
