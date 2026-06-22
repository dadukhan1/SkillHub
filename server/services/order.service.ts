/** @format */

import OrderModel from "../models/order.model";

export const newOrder = async (data: any) => {
  return await OrderModel.create(data);
};

// Get all orders
export const getAllOrdersService = async () => {
  return await OrderModel.find().sort({ createAt: -1 });
};
