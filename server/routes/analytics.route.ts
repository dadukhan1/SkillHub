/** @format */

import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getCoursesAnalytics,
  getOrdersAnalytics,
  getUserAnalytics,
} from "../controllers/anaylytics.controller";
const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-users-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getUserAnalytics,
);
analyticsRouter.get(
  "/get-orders-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrdersAnalytics,
);
analyticsRouter.get(
  "/get-orders-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursesAnalytics,
);

export default analyticsRouter;
