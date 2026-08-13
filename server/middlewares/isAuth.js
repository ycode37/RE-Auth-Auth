import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";
import { User } from "../models/user.model.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res
        .status(403)
        .json({ message: "Please login to access this route" });
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData) {
      return res.status(400).json({ message: "Token Required" });
    }

    const cacheData = await redisClient.get(`user:${decodedData.id}`);

    if (cacheData) {
      req.user = JSON.parse(cacheData);
      return next();
    }
    const user = await User.findById(decodedData.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await redisClient.setEx(`user:${user._id}`, 3600, JSON.stringify(user));
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
