/** @format */

import { Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import NotificationModel from "../models/notification.model";
import cron from "node-cron";

// get all notifications
export const getAllNotifications = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const notifications = await NotificationModel.find().sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      notifications,
    });
  },
);

// update notification status --- admin only
export const updateNotification = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const notification = await NotificationModel.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    notification.status = "read";
    await notification.save();

    const notifications = await NotificationModel.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      notifications,
    });
  },
);

// delete notification  --- admin only
cron.schedule("0 0 0 * * *", async () => {
  const thirtyDayAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDayAgo },
  });
});
