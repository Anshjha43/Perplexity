import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import airouter from "./routes/ai.route.js";
import { errorHandler } from "./middleware/error.middleware.js";
import cors from "cors";
import morgan from "morgan";

export const app = express();

// middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes
app.use("/api/auth", userRouter);
app.use("/api/chat", airouter);

// error handler
app.use(errorHandler);
