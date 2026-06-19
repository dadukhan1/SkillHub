/** @format */

import express from "express";
import {
  userActivation,
  userLogin,
  userLogout,
  userRegistration,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/register", userRegistration);
userRouter.post("/activation", userActivation);
userRouter.post("/login", userLogin);
userRouter.get("/logout", isAuthenticated, userLogout);

export default userRouter;
