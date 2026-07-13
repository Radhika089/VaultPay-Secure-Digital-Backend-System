import transactionModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import accountModel from "../models/account.model.js";
import { sendTransactionEmail } from "../services/email.service.js";
import mongoose from "mongoose";

export async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  const fromUserAccount = await accountModel.findById(fromAccount);

  if (!fromUserAccount) {
    return res.status(404).json({
      success: false,
      message: "Sender account not found",
    });
  }

  const toUserAccount = await accountModel.findById(toAccount);

  if (!toUserAccount) {
    return res.status(404).json({
      success: false,
      message: "Receiver account not found",
    });
  }

  const existingTransaction = await transactionModel.findOne({
    idempotencyKey,
  });

  if (existingTransaction) {
    switch (existingTransaction.status) {
      case "COMPLETED":
        return res.status(200).json({
          success: true,
          message: "Transaction already processed.",
          transaction: existingTransaction,
        });

      case "PENDING":
        return res.status(200).json({
          success: true,
          message: "Transaction is still processing.",
          transaction: existingTransaction,
        });

      case "FAILED":
        return res.status(400).json({
          success: false,
          message:
            "Previous transaction failed. Please try again with a new request.",
        });

      case "REVERSED":
        return res.status(400).json({
          success: false,
          message: "Transaction was reversed.",
        });

      default:
        return res.status(400).json({
          success: false,
          message: "Unknown transaction status.",
        });
    }
  }
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message:
        "Both fromAccount and toAccount must be an Active to process transaction.",
    });
  }

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current account is ${balance}. Requested amount is ${amount}`,
    });
  }

  let transaction;

  // create transaction (pending)
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            idempotencyKey,
            amount,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount: amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
    })();

    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    transaction = await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session, new: true },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await transactionModel.findOneAndUpdate(
      { idempotencyKey: idempotencyKey },
      { status: "FAILED" },
    );
    return res.status(500).json({
      message:
        "Transaction is pending due to some issues, please retry after sometime",
      error: error.message,
    });
  }

  await sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);

  return res.status(201).json({
    success: true,
    message: "Transaction Completed Successfully!",
    transaction: transaction,
  });
}

export async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  const toUserAccount = await accountModel.findOne({ _id: toAccount });

  if (!toUserAccount) {
    return res.status(400).json({
      success: false,
      message: "Invalid toAccount",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(400).json({
      success: false,
      message: "System user account not found.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  await transaction.save({ session });

  const debitLedgerEntry = new ledgerModel({
    account: fromUserAccount._id,
    amount: amount,
    transaction: transaction._id,
    type: "DEBIT",
  });

  await debitLedgerEntry.save({ session });

  const creditLedgerEntry = new ledgerModel({
    account: toAccount,
    amount: amount,
    transaction: transaction._id,
    type: "CREDIT",
  });

  await creditLedgerEntry.save({ session });

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(200).json({
    success: true,
    message: "Initial funds transaction completed successfully",
    transaction: transaction,
  });
}
