/** @format */

import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import cloudinary from "../utils/cloudinary";
import LayoutModel from "../models/layout.model";
import ErrorHandler from "../utils/ErrorHandler";

// create layout
export const createLayout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;
    const isTypeExist = await LayoutModel.findOne({ type });
    if (isTypeExist) {
      return next(new ErrorHandler(`${type} already exits`, 400));
    }
    if (type === "Banner") {
      const { image, title, subTitle } = req.body;
      const myCloud = await cloudinary.uploader.upload(image, {
        folder: "Layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subTitle,
      };
      await LayoutModel.create(banner);
    }

    if (type === "FAQ") {
      const { faq } = req.body;
      const faqItems = await Promise.all(
        faq.map(async (item: any) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        }),
      );
      await LayoutModel.create({ type: "FAQ", faq: faqItems });
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoriesItems = await Promise.all(
        categories.map(async (item: any) => {
          return {
            title: item.title,
          };
        }),
      );
      await LayoutModel.create({
        type: "Categories",
        categories: categoriesItems,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Layout created successfully",
    });
  },
);
