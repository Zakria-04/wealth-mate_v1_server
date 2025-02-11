import { Router } from "express";
import {
  authentication,
  createNewUser,
  loginUser,
} from "../Controller/user.controller";

const userRouter = Router();

userRouter.post("/create-user", createNewUser);
userRouter.post("/login-user", loginUser);

// Protect this route with authentication
userRouter.get("/protected-route", authentication, (req, res) => {
  res.json({
    success: true,
    message: "You have access to this route",
    user: req.user,
  });
});

export default userRouter;
