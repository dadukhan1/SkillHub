/** @format */

import { Request, Response, NextFunction } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import NotificationModel from "../models/notification.model";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";

const adminAudienceFilter = {
  $or: [{ audience: "admin" }, { audience: { $exists: false } }],
};

const getAdminNotifications = () =>
  NotificationModel.find({ ...adminAudienceFilter } as any).sort({ createdAt: -1 });

export const getAllNotifications = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const notifications = await getAdminNotifications();

    return res.status(200).json({
      success: true,
      notifications,
    });
  },
);

export const updateNotification = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const notification = await NotificationModel.findOneAndUpdate(
      { _id: id, ...adminAudienceFilter } as any,
      { status: "read" },
      { new: true },
    );

    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }

    const notifications = await getAdminNotifications();

    return res.status(200).json({
      success: true,
      notifications,
    });
  },
);

export const markAllNotificationsRead = catchAsyncErrors(
  async (req: Request, res: Response) => {
    await NotificationModel.updateMany(
      { ...adminAudienceFilter, status: "unread" } as any,
      { status: "read" },
    );

    const notifications = await getAdminNotifications();

    return res.status(200).json({
      success: true,
      notifications,
    });
  },
);

cron.schedule("0 0 0 * * *", async () => {
  const thirtyDayAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDayAgo },
  });
});
