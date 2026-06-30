/** @format */

import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { getAllOrdersService, newOrder } from "../services/order.service";
import CourseModel from "../models/course.model";
import { sendMail } from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import Stripe from "stripe";
import { redis } from "../utils/redis";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Stripe webhook — called by Stripe directly after successful payment
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;

    if (!courseId || !userId) {
      console.error("Webhook: missing metadata", { courseId, userId });
      return res.status(400).send("Missing metadata");
    }

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        console.error("Webhook: user not found", userId);
        return res.status(404).send("User not found");
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        console.error("Webhook: course not found", courseId);
        return res.status(404).send("Course not found");
      }

      // Idempotency: skip if user already has the course
      const alreadyOwned = user.courses.some(
        (c) => c.courseId === courseId,
      );
      if (!alreadyOwned) {
        await userModel.updateOne(
          { _id: userId },
          { $push: { courses: { courseId } } },
        );

        await CourseModel.findByIdAndUpdate(courseId, {
          $inc: { purchased: 1 },
        });

        await newOrder({ courseId, userId });

        await NotificationModel.create({
          user: userId,
          title: "New Order",
          message: `New purchase for ${course.name}.`,
          audience: "admin",
        });

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

        await sendMail({
          email: user.email,
          subject: "Order Confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        });

        const updatedUser = await userModel.findById(userId);
        await redis.set(
          userId,
          JSON.stringify(updatedUser),
          "EX",
          604800,
        );
      }
    } catch (err) {
      console.error("Webhook: failed to process order", err);
      return res.status(500).send("Internal error processing order");
    }
  }

  // Always return 200 so Stripe doesn't retry unnecessarily
  return res.status(200).json({ received: true });
};

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

export const createCheckoutSession = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.body;
    const userId = req.user?._id?.toString();

    if (!courseId) {
      return next(new ErrorHandler("Course ID is required", 400));
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    if (course.price <= 0) {
      return next(new ErrorHandler("This course is free", 400));
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const alreadyOwned = user.courses.some(
      (entry) => entry.courseId === courseId,
    );
    if (alreadyOwned) {
      return next(
        new ErrorHandler("You have already purchased this course", 400),
      );
    }

    const origin = (process.env.ORIGIN ?? "http://localhost:3000").replace(
      /\/$/,
      "",
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.name,
              description: course.description?.slice(0, 200),
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId: course._id?.toString() ?? courseId,
        userId: userId ?? "",
      },
      success_url: `${origin}/courses/${courseId}/payment-success`,
      cancel_url: `${origin}/courses/${courseId}`,
    });

    if (!session.url) {
      return next(new ErrorHandler("Failed to create checkout session", 500));
    }

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  },
);
