import express from "express";
import {
  createInitialFundsTransaction,
  createTransaction,
} from "../controllers/transaction.controller.js";
import {
  authMiddleware,
  authSystemUserMiddleware,
} from "../middleware/auth.middleware.js";

const transactionRouter = express.Router();

transactionRouter.post("/", authMiddleware, createTransaction);

// create initial funds
transactionRouter.post(
  "/system/initial-funds",
  authSystemUserMiddleware,
  createInitialFundsTransaction,
);

export default transactionRouter;
