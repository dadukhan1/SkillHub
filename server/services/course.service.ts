/** @format */

import CourseModel from "../models/course.model";

export const createCourse = async (data: any) => {
  return await CourseModel.create(data);
};

export const getAllCoursesService = async () => {
  return await CourseModel.find().sort({ createdAt: -1 });
};
