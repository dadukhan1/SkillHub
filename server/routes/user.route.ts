/** @format */

import express from "express";
import {
  userActivation,
  userRegistration,
} from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.post("/register", userRegistration);
userRouter.post("/activation", userActivation);

export default userRouter;
