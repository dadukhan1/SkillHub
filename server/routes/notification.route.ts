/** @format */

import express from "express";
const notificationRouter = express.Router();

import { getAllNotifications } from "../controllers/notification.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

notificationRouter.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllNotifications,
);

export default notificationRouter;
