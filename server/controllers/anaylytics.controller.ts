/** @format */

import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import { Request, Response } from "express";
import OrderModel from "../models/order.model";
import CourseModel from "../models/course.model";

// get users analytics --- admin only
export const getUserAnalytics = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const users = await generateLast12MonthsData(userModel);

    return res.status(200).json({ success: true, users });
  },
);

// get orders analytics --- admin only
export const getOrdersAnalytics = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const orders = await generateLast12MonthsData(OrderModel);

    return res.status(200).json({ success: true, orders });
  },
);

// get courses analytics --- admin only
export const getCoursesAnalytics = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const courses = await generateLast12MonthsData(CourseModel);

    return res.status(200).json({ success: true, courses });
  },
);
