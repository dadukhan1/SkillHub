/** @format */

import { IUser } from "../models/user.model";

export interface ClientUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    public_id?: string;
    url?: string;
  };
  isVerified: boolean;
  hasPassword: boolean;
  courses: Array<{ courseId: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export const formatUserForClient = (user: IUser): ClientUser => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  isVerified: Boolean(user.isVerified),
  hasPassword: Boolean(user.password),
  courses: user.courses ?? [],
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
