/** @format */

import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import cloudinary from "../utils/cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";

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

    await redis.del("allCourses");

    return res.status(200).json({
      success: true,
      course,
    });
  },
);

export const editCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const courseId = req.params.id as string;

    const thumbnail = data.thumbnail;

    const course = await CourseModel.findById(courseId);

    if (thumbnail) {
      if (
        course?.thumbnail &&
        typeof course.thumbnail === "object" &&
        "public_id" in course.thumbnail
      ) {
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

    await redis.del(courseId);
    await redis.del("allCourses");

    return res.status(200).json({
      success: true,
      updatedCourse,
    });
  },
);

// Get single course
export const getSingleCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id as string;
    const isCached = await redis.get(courseId);

    if (isCached) {
      const course = JSON.parse(isCached);

      return res.status(200).json({
        success: true,
        course,
      });
    }
    const course = await CourseModel.findById(courseId).select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
    );

    await redis.set(courseId, JSON.stringify(course));

    return res.status(200).json({
      success: true,
      course,
    });
  },
);

// Get all courses
export const getAllCourses = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const isCached = await redis.get("allCourses");
    if (isCached) {
      const courses = JSON.parse(isCached);

      return res.status(200).json({
        success: true,
        courses,
      });
    }

    const courses = await CourseModel.find().select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
    );

    await redis.set("allCourses", JSON.stringify(courses), "EX", 3600);

    return res.status(200).json({
      success: true,
      courses,
    });
  },
);

// Get courses content --- only for valid users
export const getCoursesByUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCoursesList = req.user?.courses;
    const courseId = req.params.id;

    const courseExists = userCoursesList?.find(
      (course: any) => course._id.toString() === courseId,
    );

    if (!courseExists) {
      return next(
        new ErrorHandler("Your not eligible to access this course.", 400),
      );
    }

    const course = await CourseModel.findById(courseId);

    const content = course?.courseData;

    return res.status(200).json({
      success: true,
      content,
    });
  },
);
