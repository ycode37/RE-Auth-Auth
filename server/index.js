import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import { createClient } from "redis";
import cookieParser from "cookie-parser";

dotenv.config();
await connectDB(); // Connect to MongoDB

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  console.log("Missing Redis URL");
  process.exit(1);
}
export const redisClient = createClient({
  url: REDIS_URL,
});
redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch(console.error);

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use("/api/v1", userRoutes); // Use the user routes for API version 1

const PORT = process.env.PORT || 5001;

// Define what happens when someone visits localhost:5001/
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
