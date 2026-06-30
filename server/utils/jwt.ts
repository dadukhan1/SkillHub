/** @format */

import "dotenv/config";
import { Response } from "express";
import { IUser } from "../models/user.model";
import userModel from "../models/user.model";
import { cacheUserSession } from "../services/user.service";
import { formatUserForClient } from "./formatUser";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// parse environment variables to integration with failback values
const accessTokenExpires = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES || "300000",
  10,
);
const refreshTokenExpires = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES || "259200",
  10,
);

// options for cookies
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 1000),
  maxAge: accessTokenExpires * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpires * 1000),
  maxAge: refreshTokenExpires * 1000,
  httpOnly: true, 
  sameSite: "none",
  secure: true,
};

export const sendToken = async (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  const dbUser = await userModel.findById(user._id).select("+password");
  const clientUser = formatUserForClient(dbUser ?? user);

  await cacheUserSession(clientUser);

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user: clientUser,
    accessToken,
  });
};
