import { Response } from "express";
const errorMessage = (error: unknown, res: Response) => {
  const serverError =
    error instanceof Error ? error.message : "un unknown error occurred!";

  res.status(500).json({ errorMsg: serverError });
};
export default errorMessage;
