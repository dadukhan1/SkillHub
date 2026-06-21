/** @format */

import { Document, Model, model, Schema } from "mongoose";

interface IOrder extends Document {
  courseId: string;
  userId: string;
  paymentInfo: object;
}

const orderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    paymentInfo: {
      type: Object,
    },
  },
  { timestamps: true },
);

const OrderModel: Model<IOrder> = model<IOrder>("Order", orderSchema);

export default OrderModel;
