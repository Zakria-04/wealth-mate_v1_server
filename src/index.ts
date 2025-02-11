import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import Routes from "./API/Routes/Router";
dotenv.config();

const app = express();

// MiddleWare
app.use(express.json());
app.use(cors());
app.use("/", Routes)

const db_url = process.env.DB_URL;

//TODO => if you find this error you need to create .env file and add your mongoDB url inside DB_URL variable
if (!db_url) {
  throw new Error("Missing DB_URL environment variable");
}

mongoose.connect(db_url);

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("mongoose connection error", err);
});

export default app;
