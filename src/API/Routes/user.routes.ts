import { Router } from "express";
import { createNewUser, loginUser } from "../Controller/user.controller";

const userRouter = Router();

userRouter.post("/create-user", createNewUser);
userRouter.post("/login-user", loginUser);

export default userRouter;
