import { Request, Response, NextFunction } from "express";
import USER_MODEL from "../Model/user.model";
import bcrypt from "bcryptjs";
import errorMessage from "../utils/errorMessage";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {};
    }
  }
}

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

const createNewUser = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  try {
    const hashPass = await bcrypt.hash(password, 10);

    const user = await USER_MODEL.create({
      userName,
      email,
      password: hashPass,
    });

    // const token = jwt.sign(
    //   { userID: user._id, email: user.email },
    //   SECRET_KEY,
    //   {
    //     expiresIn: "1h",
    //   }
    // );

    res.json({ user });
  } catch (error) {
    errorMessage(error, res);
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { userNameOrEmail, email, password } = req.body;
  try {
    const user = await USER_MODEL.findOne({
      $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
    });

    if (!user) {
      res.status(404).json({ error: "user cannot be found" });
      return;
    }

    const compareHashedPass = await bcrypt.compare(password, user.password);

    if (!compareHashedPass) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }

    res.status(200).json({ auth: true, user });
  } catch (error) {
    errorMessage(error, res);
  }
};

export { createNewUser, loginUser };
