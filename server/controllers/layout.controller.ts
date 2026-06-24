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

// update layout
export const updateLayout = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { type } = req.body;
    if (type === "Banner") {
      const bannerData = await LayoutModel.findOne({ type: "Banner" });
      const { image, title, subTitle } = req.body;

      if (bannerData) {
        await cloudinary.uploader.destroy(bannerData?.banner.image.public_id);
      }

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
      await LayoutModel.findByIdAndUpdate(bannerData?._id, { banner });
    }

    if (type === "FAQ") {
      const { faq } = req.body;
      const FaqItem = await LayoutModel.findOne({ type: "FAQ" });

      const faqItems = await Promise.all(
        faq.map(async (item: any) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        }),
      );
      await LayoutModel.findByIdAndUpdate(FaqItem?._id, {
        type: "FAQ",
        faq: faqItems,
      });
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoriesData = await LayoutModel.findOne({ type: "Categories" });
      const categoriesItems = await Promise.all(
        categories.map(async (item: any) => {
          return {
            title: item.title,
          };
        }),
      );
      await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
        type: "Categories",
        categories: categoriesItems,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Layout updated successfully",
    });
  },
);

// get layout by type
export const getLayoutByType = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const type = req.body.type;
    const layout = await LayoutModel.findOne({ type });
    res.status(201).json({
      success: true,
      layout,
    });
  },
);
