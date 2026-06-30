/** @format */

import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import cloudinary from "../utils/cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";
import { sendMail } from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import axios from "axios";

export const uploadCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (
      thumbnail &&
      typeof thumbnail === "string" &&
      thumbnail.startsWith("data:")
    ) {
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

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    if (
      thumbnail &&
      typeof thumbnail === "string" &&
      thumbnail.startsWith("data:")
    ) {
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

    await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7 days expiry

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
    const isAdmin = req.user?.role === "admin";

    const courseExists = userCoursesList?.find(
      (course: any) =>
        course.courseId?.toString() === courseId ||
        course._id?.toString() === courseId,
    );

    if (!courseExists && !isAdmin) {
      return next(
        new ErrorHandler("Your not eligible to access this course.", 400),
      );
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    return res.status(200).json({
      success: true,
      course: {
        _id: course._id,
        name: course.name,
        description: course.description,
        thumbnail: course.thumbnail,
        level: course.level,
        tags: course.tags,
      },
      content: course.courseData,
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

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid content id", 400));
    }

    const courseContent = course.courseData?.find((item: any) =>
      item._id.equals(contentId),
    );

    if (!courseContent) {
      return next(new ErrorHandler("Invalid content id", 400));
    }

    if (!courseContent.questions) {
      courseContent.questions = [];
    }

    const newQuestion = {
      user: req.user,
      question,
      questionReplies: [],
    } as any;

    courseContent.questions.push(newQuestion);

    await course.save();

    const savedQuestion =
      courseContent.questions[courseContent.questions.length - 1];

    void NotificationModel.create({
      user: req.user?._id.toString(),
      title: "New Question",
      message: `${req.user?.name} has asked a new question in ${courseContent.title}.`,
      audience: "admin",
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      contentId,
      question: savedQuestion,
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

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid content id", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return next(new ErrorHandler("Invalid question id", 400));
    }

    const courseContent = course.courseData?.find((item: any) =>
      item._id.equals(contentId),
    );

    if (!courseContent) {
      return next(new ErrorHandler("Invalid content id", 400));
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

    if (!question.questionReplies) {
      question.questionReplies = [];
    }

    question.questionReplies.push(newAnswer);

    await course.save();

    const savedAnswer =
      question.questionReplies[question.questionReplies.length - 1];

    const notifyStudent = async () => {
      try {
        await NotificationModel.create({
          user: question.user._id.toString(),
          title: "New Answer",
          message: `${req.user?.name} has answered your question in the course ${courseContent.title}.`,
          audience: "user",
        });

        await sendMail({
          email: question.user.email,
          subject: "New Reply Received",
          template: "question-reply.ejs",
          data: {
            name: question.user.name,
            title: courseContent.title,
          },
        });
      } catch {
        // Non-blocking side effects.
      }
    };

    void notifyStudent();

    return res.status(200).json({
      success: true,
      contentId,
      questionId,
      answer: savedAnswer,
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
      course.courseId?.toString() === courseId || course._id?.toString() === courseId,
    );

    if (!courseExists) {
      return next(new ErrorHandler("Your not eligible to this course", 400));
    }

    const course = await CourseModel.findById(courseId);

    const isReviewExists = course?.reviews?.find(
      (rev: any) => rev.user._id.toString() === req.user?._id.toString()
    );

    if (isReviewExists) {
      return next(new ErrorHandler("You have already reviewed this course", 400));
    }

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

    await redis.del(courseId as string);
    await redis.del("allCourses");

    // Create notification
    await NotificationModel.create({
      user: req.user?._id.toString(),
      title: "New Review Added",
      message: `${req.user?.name} has added a new review for ${course?.name}.`,
      audience: "admin",
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

// Get single course for admin --- full data
export const getCourseForAdmin = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id as string;
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    return res.status(200).json({
      success: true,
      course,
    });
  },
);

// Get all courses ------ admin only
export const getAllCoursesForAdmin = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const courses = await getAllCoursesService();

    return res.status(200).json({
      success: true,
      courses,
    });
  },
);

// Delete course --- admin only
export const deleteCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const course = await CourseModel.findById(id);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    if (
      course.thumbnail &&
      typeof course.thumbnail === "object" &&
      "public_id" in course.thumbnail
    ) {
      await cloudinary.uploader.destroy((course.thumbnail as any).public_id);
    }

    await CourseModel.deleteOne({ _id: id });

    await redis.del(id.toString());
    await redis.del("allCourses");

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });
  },
);

export const generateVideoUrl = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.body;

    if (!videoId || typeof videoId !== "string") {
      return next(new ErrorHandler("Video ID is required", 400));
    }

    if (!process.env.VDOCIPHER_API_KEY) {
      return next(new ErrorHandler("VdoCipher API key is not configured", 500));
    }

    try {
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId.trim()}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_KEY}`,
          },
        },
      );

      return res.status(200).json({
        success: true,
        videoUrl: response.data,
      });
    } catch {
      return next(new ErrorHandler("Failed to generate video access", 502));
    }
  },
);
