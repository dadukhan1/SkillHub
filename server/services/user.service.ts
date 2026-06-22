/** @format */

import userModel from "../models/user.model";
import { redis } from "../utils/redis";

export const getUserById = async (id: string) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    return user;
  }
};

export const getAllUsersService = async () => {
  return await userModel.find().sort({ createAt: -1 });
};

// update user role
export const updateUserRoleService = async (id: any, role: any) => {
  return await userModel.findByIdAndUpdate(id, { role }, { new: true });
};
