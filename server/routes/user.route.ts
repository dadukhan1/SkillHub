/** @format */

import express from "express";
import {
  userActivation,
  userLogin,
  userLogout,
  userRegistration,
} from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.post("/register", userRegistration);
userRouter.post("/activation", userActivation);
userRouter.post("/login", userLogin);
userRouter.post("/logout", userLogout);

export default userRouter;
