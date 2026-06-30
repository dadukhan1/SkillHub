/** @format */

import express, { NextFunction, Request, Response } from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import errorHandlerMiddleware from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";

// Stripe webhook needs raw body — must be before express.json()
app.use(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

const allowedOrigin = (process.env.ORIGIN ?? "http://localhost:3000")
  .trim()
  .replace(/\/$/, "");

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);

// routes
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", analyticsRouter);
app.use("/api/v1", layoutRouter);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    success: true,
    message: "API is working",
  });
});

app.get("/*splat", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Error ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(errorHandlerMiddleware);

export default app;