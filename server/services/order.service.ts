/** @format */

import OrderModel from "../models/order.model";

export const newOrder = async (data: any) => {
  return await OrderModel.create(data);
};
