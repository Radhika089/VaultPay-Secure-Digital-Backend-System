import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createAccount } from "../controllers/account.controller.js ";
import {
  getAccountBalance,
  getUserAccount,
} from "../controllers/account.controller.js";

const accountRouter = express.Router();

accountRouter.post("/", authMiddleware, createAccount);
accountRouter.get("/", authMiddleware, getUserAccount);

accountRouter.get("/balance/:accountId", authMiddleware, getAccountBalance);

export default accountRouter;
