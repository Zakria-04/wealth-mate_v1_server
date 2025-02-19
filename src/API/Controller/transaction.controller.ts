import { Request, Response } from "express";
import TRANSACTION_MODEL from "../Model/transaction.model";
import errorMessage from "../utils/errorMessage";

const createNewTransaction = async (req: Request, res: Response) => {
  const { name, category, wallet, sum } = req.body;

  if (!name || !category || !wallet || !sum) {
    res
      .status(401)
      .json({ success: false, message: "missing required inputs" });
    return;
  }
  try {
    const newTransaction = await TRANSACTION_MODEL.create({
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

const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await TRANSACTION_MODEL.find({}).sort({ date: -1 });
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    errorMessage(error, res);
  }
};

const transactionSummary = async (req: Request, res: Response) => {
  try {
    const result = await TRANSACTION_MODEL.aggregate([
      {
        $group: {
          _id: "$category",
          totalSum: { $sum: "$sum" },
        },
      },
    ]);

    let income = 0,
      expenses = 0;

    result.forEach((item) => {
      if (item._id === "income") {
        income = item.totalSum;
      } else {
        expenses += item.totalSum;
      }
    });

    const balance = income - expenses;
    const savings = balance;

    res.status(200).json({
      success: true,
      transactionSummary: { income, expenses, balance, savings },
    });
  } catch (error) {
    errorMessage(error, res);
  }
};

export { createNewTransaction, getAllTransactions, transactionSummary };
