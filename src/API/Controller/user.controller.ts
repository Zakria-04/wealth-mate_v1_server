import { Request, Response, NextFunction } from "express";
import USER_MODEL from "../Model/user.model";
import bcrypt from "bcryptjs";
import errorMessage from "../utils/errorMessage";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const ACCESS_SECRET = process.env.ACCESS_SECRET_KEY;
const REFRESH_SECRET = process.env.REFRESH_SECRET_KEY;

//TODO if you got this error make sure to add SECRET_KEY inside .env
if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("Missing secret keys in .env file");
}

const createNewUser = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  try {
    const hashPass = await bcrypt.hash(password, 10);

    const user = await USER_MODEL.create({
      userName,
      email,
      password: hashPass,
    });

    const accessToken = jwt.sign(
      { userID: user._id, email: user.email },
      ACCESS_SECRET,
      { expiresIn: "15m" } // Short lifespan
    );

    const refreshToken = jwt.sign(
      { userID: user._id },
      REFRESH_SECRET,
      { expiresIn: "7d" } // Longer lifespan
    );

    res.json({ accessToken, refreshToken });
  } catch (error) {
    errorMessage(error, res);
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { userNameOrEmail, password } = req.body;

  try {
    // Find user by username or email
    const user = await USER_MODEL.findOne({
      $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Invalid password" });
      return;
    }

    const accessToken = jwt.sign(
      { userID: user._id, email: user.email },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign({ userID: user._id }, ACCESS_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    errorMessage(error, res);
  }
};

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as {
      userID: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const refreshToken = (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res.status(401).json({ success: false, message: "Refresh token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as { userID: string };

    const newAccessToken = jwt.sign({ userID: decoded.userID }, ACCESS_SECRET, {
      expiresIn: "15m",
    });
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

export { createNewUser, loginUser, authentication, refreshToken };
