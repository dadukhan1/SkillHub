/** @format */

import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail";

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
