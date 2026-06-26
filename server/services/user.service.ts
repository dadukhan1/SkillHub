/** @format */

import userModel from "../models/user.model";
import { redis } from "../utils/redis";
import { ClientUser, formatUserForClient } from "../utils/formatUser";

const SESSION_TTL_SECONDS = 604800; // 7 days

export const cacheUserSession = async (user: ClientUser) => {
  await redis.set(
    user._id.toString(),
    JSON.stringify(user),
    "EX",
    SESSION_TTL_SECONDS,
  );
};

export const getUserById = async (id: string): Promise<ClientUser | null> => {
  const user = await userModel.findById(id).select("+password");
  if (!user) return null;

  const clientUser = formatUserForClient(user);
  await cacheUserSession(clientUser);
  return clientUser;
};

export const getAllUsersService = async () => {
  return await userModel.find().sort({ createAt: -1 });
};

// update user role
export const updateUserRoleService = async (id: any, role: any) => {
  return await userModel.findByIdAndUpdate(id, { role }, { new: true });
};
