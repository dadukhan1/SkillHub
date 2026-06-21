/** @format */

import catchAsyncErrors from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";

export const createCourse = async (data: any) => {
  return await CourseModel.create(data);
};
