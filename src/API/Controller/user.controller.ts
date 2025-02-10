import { Request, Response } from "express";
import USER_MODEL from "../Model/user.model";
import bcrypt from "bcryptjs"

const createNewUser = (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  try {
    const user = USER_MODEL.create({
      userName,
      email,
      password,
    });
  } catch (error) {}
};

export { createNewUser };
