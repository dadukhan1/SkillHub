/** @format */

import express from "express";
import {
  getAllUsers,
  getUserInfo,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
  userActivation,
  userLogin,
  userLogout,
  userRegistration,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/register", userRegistration);
userRouter.post("/activation", userActivation);
userRouter.post("/login", userLogin);
userRouter.get("/logout", isAuthenticated, userLogout);
userRouter.get("/refresh-token", updateAccessToken);
userRouter.get("/social-auth", socialAuth);

userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.put("/update-user-password", isAuthenticated, updatePassword);
userRouter.put(
  "/update-profile-picture",
  isAuthenticated,
  updateProfilePicture,
);
userRouter.get(
  "/get-all-users",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsers,
);
userRouter.put(
  "/update-user-role",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole,
);

export default userRouter;
