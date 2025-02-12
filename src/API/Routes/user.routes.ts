import { Router } from "express";
import {
  createNewUser,
  loginUser,
  authentication,
  // refreshToken,
} from "../Controller/user.controller";

const userRouter = Router();

userRouter.post("/create-user", createNewUser);
userRouter.post("/login-user", loginUser);

// Protect this route with authentication
userRouter.get("/protected-route", authentication);

export default userRouter;
