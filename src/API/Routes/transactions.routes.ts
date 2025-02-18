import { Router } from "express";
import { createNewTransaction } from "../Controller/transaction.controller";

const transactionRouter = Router();

transactionRouter.post("/create-transaction", createNewTransaction);

export default transactionRouter;
