/** @format */

import express from "express";
import {
  createCheckoutSession,
  getAllOrders,
  stripeWebhook,
} from "../controllers/order.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const orderRouter = express.Router();

// Stripe webhook — no auth, raw body handled in app.ts
orderRouter.post("/payment/webhook", stripeWebhook);

orderRouter.get(
  "/get-all-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders,
);

orderRouter.post(
  "/payment/checkout-session",
  isAuthenticated,
  createCheckoutSession,
);

export default orderRouter;
