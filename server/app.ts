/** @format */

import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
  }),
);

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
