import { Router } from "express";
import {
  createNewTransaction,
  getAllTransactions,
  transactionSummary,
} from "../Controller/transaction.controller";

const transactionRouter = Router();

transactionRouter.post("/create-transaction", createNewTransaction);
transactionRouter.get("/transactions", getAllTransactions);
transactionRouter.get("/transaction-summary", transactionSummary);

export default transactionRouter;
