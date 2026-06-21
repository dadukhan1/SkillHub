/** @format */

import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import cloudinary from "../utils/cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";

export const uploadCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      const myCloud = await cloudinary.uploader.upload(thumbnail, {
        folder: "courses",
      });

      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const course = await createCourse(data);

    return res.status(200).json({
      success: true,
      course,
    });
  },
);

export const editCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const courseId = req.params.id;

    const thumbnail = data.thumbnail;

    const course = await CourseModel.findById(courseId);

    if (thumbnail ) {
      if (course?.thumbnail && typeof course.thumbnail === 'object' && 'public_id' in course.thumbnail) {
        await cloudinary.uploader.destroy((course.thumbnail as any).public_id);
      }

      const myCloud = await cloudinary.uploader.upload(thumbnail, {
        folder: "courses",
      });

      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const updatedCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      { $set: data },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      updatedCourse,
    });
  },
);
