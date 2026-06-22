/** @format */

import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { getAllOrdersService, newOrder } from "../services/order.service";
import CourseModel from "../models/course.model";
import { sendMail } from "../utils/sendMail";
import NotificationModel from "../models/notification.model";

export const createOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, paymentInfo } = req.body;

    const user = await userModel.findById(req.user?._id?.toString());

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const courseExistsInUser = user.courses.some(
      (course) => course.courseId === courseId,
    );

    if (courseExistsInUser) {
      return next(
        new ErrorHandler("You have already purchased this course", 400),
      );
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const data: any = {
      courseId: course._id?.toString(),
      userId: user._id?.toString(),
    };

    const mailData = {
      order: {
        _id: course._id.toString(),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };

    const updated = await userModel.updateOne(
      { _id: user._id, "courses.courseId": { $ne: courseId } },
      { $push: { courses: { courseId } } },
    );

    if (updated.modifiedCount === 0) {
      return next(new ErrorHandler("Already purchased", 400));
    }

    await CourseModel.findByIdAndUpdate(courseId, {
      $inc: { purchased: 1 },
    });

    await newOrder(data);

    await NotificationModel.create({
      user: user._id?.toString(),
      title: "New Order",
      message: `You have a new order for the course: ${course.name}`,
    });

    await sendMail({
      email: user.email,
      subject: "Order Confirmation",
      template: "order-confirmation.ejs",
      data: mailData,
    });

    return res.status(200).json({
      success: true,
      order: course,
    });
  },
);

// Get all orders ------ admin only
export const getAllOrders = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const orders = await getAllOrdersService();

    return res.status(200).json({
      success: true,
      orders,
    });
  },
);
