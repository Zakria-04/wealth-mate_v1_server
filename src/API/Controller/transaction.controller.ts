import { Request, Response } from "express";
import TRANSACTION_MODEL from "../Model/transaction.model";
import errorMessage from "../utils/errorMessage";

const createNewTransaction = (req: Request, res: Response) => {
  const { name, category, wallet, sum } = req.body;

  if (!name || !category || !wallet || !sum) {
    res
      .status(401)
      .json({ success: false, message: "missing required inputs" });
    return;
  }
  try {
    const newTransaction = TRANSACTION_MODEL.create({
      name,
      category,
      wallet,
      sum,
    });
    res.status(200).json({ success: true, newTransaction });
  } catch (error) {
    errorMessage(error, res);
  }
};

export { createNewTransaction };
