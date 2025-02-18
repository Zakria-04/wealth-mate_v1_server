import { model, Schema } from "mongoose";

const transactionsHistorySchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  wallet: {
    type: String,
    required: true,
  },
  sum: {
    type: Number,
    required: true,
  },
});

const TRANSACTION_MODEL = model(
  "transaction",
  transactionsHistorySchema
);

export default TRANSACTION_MODEL;
