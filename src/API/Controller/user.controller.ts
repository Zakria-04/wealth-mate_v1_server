import { Request, Response, NextFunction } from "express";
// import USER_MODEL from "../Model/user.model";
import bcrypt from "bcryptjs";
import errorMessage from "../utils/errorMessage";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import USER_MODEL from "../Model/user.model";

dotenv.config();

// declare global {
//   namespace Express {
//     interface Request {
//       user?: any;
//     }
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const ACCESS_SECRET = process.env.ACCESS_SECRET_KEY;
const REFRESH_SECRET = process.env.REFRESH_SECRET_KEY;

// //TODO if you got this error make sure to add SECRET_KEY inside .env
if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("Missing secret keys in .env file");
}

// const refreshToken = (req: Request, res: Response) => {
//   const { token } = req.body;

//   if (!token) {
//     res.status(401).json({ success: false, message: "Refresh token required" });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, REFRESH_SECRET) as { userID: string };

//     const newAccessToken = jwt.sign({ userID: decoded.userID }, ACCESS_SECRET, {
//       expiresIn: "15m",
//     });
//     res.json({ accessToken: newAccessToken });
//   } catch (error) {
//     res
//       .status(403)
//       .json({ success: false, message: "Invalid or expired refresh token" });
//   }
// };

const createNewUser = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    res
      .status(401)
      .json({ success: false, message: "missing required inputs" });
    return;
  }

  try {
    const hashPass = await bcrypt.hash(password, 10);

    const user = await USER_MODEL.create({
      email,
      userName,
      password: hashPass,
    });

    // create token
    const payload = {
      userID: user._id,
      email: user.email,
      userName: user.userName,
    };
    const token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h" });
    res.status(200).json({ success: true, token });
  } catch (error) {
    errorMessage(error, res);
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    res
      .status(401)
      .json({ success: false, message: "missing required inputs" });
    return;
  }

  try {
    // find user
    const user = await USER_MODEL.findOne({
      $or: [{ userName: userName }, { email: userName }],
    });

    if (!user) {
      res.status(401).json({ success: false, message: "unauthorized" });
      return;
    }

    // compare password with the provided one
    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) {
      res.status(401).json({ success: false, message: "unauthorized" });
      return;
    }

    // create token
    const payload = {
      userID: user._id,
      email: user.email,
      userName: user.userName,
    };
    const token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h" });

    // send response
    res.status(200).json({ token });
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
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded;
    next();
    res.json({
      success: true,
      message: "You have access to this route",
      user: req.user,
    });
  } catch (error) {
    errorMessage(error, res);
  }
};

export { createNewUser, loginUser, authentication };
