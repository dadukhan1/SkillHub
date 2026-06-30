/** @format */

import express from "express";
import {
  getAllNotifications,
  markAllNotificationsRead,
  updateNotification,
} from "../controllers/notification.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllNotifications,
);

notificationRouter.put(
  "/update-notification/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotification,
);

notificationRouter.put(
  "/mark-all-notifications-read",
  isAuthenticated,
  authorizeRoles("admin"),
  markAllNotificationsRead,
);

export default notificationRouter;
