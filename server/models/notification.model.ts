/** @format */

import { Model, model, Schema } from "mongoose";

export interface INotification {
  title: string;
  message: string;
  status: string;
  user: string;
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
      required: true,
      default: "unread",
    },
  },
  { timestamps: true },
);

const NotificationModel: Model<INotification> = model<INotification>(
  "Notification",
  notificationSchema,
);

export default NotificationModel;
