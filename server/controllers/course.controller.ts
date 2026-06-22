/** @format */

import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import cloudinary from "../utils/cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";
import { sendMail } from "../utils/sendMail";
import NotificationModel from "../models/notification.model";

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

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { question, courseId, contentId }: IAddQuestionData = req.body;
    const course = await CourseModel.findById(courseId);

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid content id", 400));
    }

    const courseContent = course?.courseData?.find((item: any) =>
      item._id.equals(contentId),
    );

    if (!courseContent) {
      return next(new ErrorHandler("Invalid course id", 400));
    }

    const newQuestion = {
      user: req.user,
      question,
      questionReplies: [],
    } as any;

    courseContent.questions.push(newQuestion);

    await NotificationModel.create({
      user: req.user?._id.toString(),
      title: "New Question",
      message: `${req.user?.name} has asked a new question in your course ${courseContent.title}.`,
    });

    await course?.save();

    return res.status(200).json({
      sucess: true,
      course,
    });
  },
);

interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { answer, courseId, contentId, questionId }: IAddAnswerData =
      req.body;

    const course = await CourseModel.findById(courseId);

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid content id", 400));
    }

    const courseContent = course?.courseData?.find((item: any) =>
      item._id.equals(contentId),
    );

    if (!courseContent) {
      return next(new ErrorHandler("Invalid course id", 400));
    }

    const question = courseContent.questions?.find((item: any) =>
      item._id.equals(questionId),
    );

    if (!question) {
      return next(new ErrorHandler("Invalid question id", 400));
    }

    const newAnswer: any = {
      user: req.user,
      answer,
    };

    question.questionReplies?.push(newAnswer);

    await course?.save();

    await NotificationModel.create({
      user: question.user._id.toString(),
      title: "New Answer",
      message: `${req.user?.name} has answered your question in the course ${courseContent.title}.`,
    });

    const data = {
      name: question.user.name,
      title: courseContent.title,
    };

    await sendMail({
      email: question.user.email,
      subject: "New Reply Received",
      template: "question-reply.ejs",
      data,
    });

    return res.status(200).json({
      success: true,
      course,
    });
  },
);

interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const addReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { review, rating } = req.body as IAddReviewData;
    const userCoursesList = req.user?.courses;

    const courseId = req.params.id;

    const courseExists = userCoursesList?.find((course: any) =>
      course._id.equals(courseId),
    );

    if (!courseExists) {
      return next(new ErrorHandler("Your not eligible to this course", 400));
    }

    const course = await CourseModel.findById(courseId);

    const reviewData = {
      user: req.user,
      comment: review,
      rating,
    } as any;

    course?.reviews.push(reviewData);

    let avg = 0;

    course?.reviews.forEach((review) => {
      avg += review.rating;
    });
    if (course) {
      course!.ratings = avg / course.reviews.length; // Calculate average rating
    }

    await course?.save();

    const notification = {
      title: "New Review Added",
      message: `${req.user?.name} has added a new review for your course ${course?.name}.`,
    };

    // Create notification
    await NotificationModel.create({
      user: req.user?._id.toString(),
      title: "New Review Added",
      message: `${req.user?.name} has added a new review for your course ${course?.name}.`,
    });

    return res.status(200).json({
      success: true,
      course,
    });
  },
);

interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReviewReply = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { comment, courseId, reviewId } = req.body as IAddReviewData;

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const review = course?.reviews.find((review) =>
      review._id.equals(reviewId),
    );

    if (!review) {
      return next(new ErrorHandler("Review not found", 404));
    }

    const replyData = {
      user: req.user,
      comment,
    } as any;

    if (!review.commentReplies) {
      review.commentReplies = [];
    }

    review.commentReplies.push(replyData);

    await course?.save();

    return res.status(200).json({
      success: true,
      course,
    });
  },
);
