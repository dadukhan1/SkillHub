/** @format */

import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendMail } from "../utils/sendMail";
import errorHandlerMiddleware from "../middleware/error";
import { accessTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import cloudinary from "../utils/cloudinary";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const userRegistration = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    const user: IRegistrationBody = {
      name,
      email,
      password,
    };

    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;

    const data = {
      user: { name: user.name },
      activationCode,
    };
    await sendMail({
      email: user.email,
      subject: "Activate your account.",
      template: "activation-mail.ejs",
      data,
    });

    return res.status(201).json({
      success: true,
      message: `Please check your email: ${user.email} to activate your account!`,
      activationToken: activationToken.token,
    });
  },
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET!,
    { expiresIn: "5m" },
  );

  return { token, activationCode };
};

interface IActivationRequest {
  activationToken: string;
  activationCode: string;
}

export const userActivation = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activationCode, activationToken } = req.body as IActivationRequest;

    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activationToken,
      process.env.ACTIVATION_SECRET as string,
    ) as { user: IUser; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password } = newUser.user;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler("Email already exists.", 400));
    }

    await userModel.create({ name, email, password });

    return res.status(201).json({
      success: true,
      message: "Account activated successfully",
    });
  },
);

interface ILoginRequest {
  email: string;
  password: string;
}

export const userLogin = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as ILoginRequest;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password.", 400));
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendToken(user, 200, res);
  },
);

export const userLogout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    redis.del(req.user?._id.toString() || "");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  },
);

// update access token
export const updateAccessToken = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let { refreshToken } = req.cookies;
    if (!refreshToken) {
      return next(
        new ErrorHandler("Please login to access this resource", 401),
      );
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN as string,
    ) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("Invalid or expired refresh token", 401));
    }

    const session = await redis.get(decoded.id);
    if (!session) {
      return next(
        new ErrorHandler("Session not found. Please login again.", 401),
      );
    }

    const user = JSON.parse(session) as IUser;

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN as string,
      { expiresIn: "5m" },
    );

    res.cookie("accessToken", accessToken, accessTokenOptions);

    await redis.set(user._id.toString(), JSON.stringify(user), "EX", 604800); // 7 days

    return res.status(200).json({ sucess: true, accessToken });
  },
);

// get user info
export const getUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await getUserById(req.user?._id.toString() || "");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    return res.status(200).json({
      success: true,
      user,
    });
  },
);

interface ISocialAuth {
  name: string;
  email: string;
  avatar?: string;
}

// social auth
export const socialAuth = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, avatar } = req.body as ISocialAuth;

    if (!name || !email) {
      return next(new ErrorHandler("Please provide name and email", 400));
    }

    const avatarData =
      typeof avatar === "string" && avatar.length > 0
        ? { url: avatar }
        : undefined;

    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        name,
        email,
        avatar: avatarData,
        isVerified: true,
      });
    }

    sendToken(user, 200, res);
  },
);

interface IUpdateUser {
  name?: string;
  email?: string;
}

export const updateUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body as IUpdateUser;

    const userId = req.user?._id.toString() || "";
    const user = await userModel.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    // Update user information
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    await redis.set(userId, JSON.stringify(user));

    return res.status(200).json({
      success: true,
      user,
    });
  },
);

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body as IUpdatePassword;

    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("Please provide old and new password", 400));
    }

    const user = await userModel
      .findById(req.user?._id.toString() || "")
      .select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (!user?.password) {
      return next(
        new ErrorHandler("Password login not enabled for this account", 400),
      );
    }

    const isPasswordMatch = await user?.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }

    user.password = newPassword;
    await user.save();

    await redis.set(user._id.toString(), JSON.stringify(user));

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  },
);

export const updateProfilePicture = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { avatar } = req.body;

    const userId = req.user?._id.toString() || "";
    const user = await userModel.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.avatar?.public_id) {
      // Delete the old avatar from cloudinary
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const uploadResult = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
    });

    user.avatar = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };

    await user.save();

    await redis.set(userId, JSON.stringify(user));

    return res.status(200).json({
      success: true,
      user,
    });
  },
);

// Get all users ------ admin only
export const getAllUsers = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const users = await getAllUsersService();

    return res.status(200).json({
      success: true,
      users,
    });
  },
);

// udpate user roles --- admin only
export const updateUserRole = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { id, role } = req.body;
    const user = updateUserRoleService(id, role);
    return res.status(200).json({
      success: true,
      user,
    });
  },
);

// Delete user --- admin only
export const deleteUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = userModel.findById(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    await userModel.deleteOne({ id });

    await redis.del(id.toString());

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  },
);
