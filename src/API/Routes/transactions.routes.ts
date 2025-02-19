import { Router } from "express";
import { createNewTransaction, getAllTransactions } from "../Controller/transaction.controller";

const transactionRouter = Router();

transactionRouter.post("/create-transaction", createNewTransaction);
transactionRouter.get("/transactions", getAllTransactions);

export default transactionRouter;
