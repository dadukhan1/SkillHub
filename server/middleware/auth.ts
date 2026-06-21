/** @format */

import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from "jsonwebtoken";
import { redis } from "../utils/redis";

// isAuthenticated middleware to protect routes and ensure the user is authenticated
export const isAuthenticated = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return next(
        new ErrorHandler("Please login to access this resource", 401),
      );
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN as string);

    if (!decoded) {
      return next(new ErrorHandler("Invalid or expired token", 401));
    }

    const user = await redis.get((decoded as any).id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = JSON.parse(user);
    next();
  },
);

// authorizeRoles middleware to restrict access based on user roles
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler("You are not allowed to access this resource", 403),
      );
    }
    next();
  };
};
