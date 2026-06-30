/** @format */

import { Model, model, Schema } from "mongoose";

export interface INotification {
  title: string;
  message: string;
  status: "unread" | "read";
  user?: string;
  audience: "admin" | "user";
}

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    user: {
      type: String,
    },
    audience: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
  },
  { timestamps: true },
);

const NotificationModel: Model<INotification> = model<INotification>(
  "Notification",
  notificationSchema,
);

export default NotificationModel;
