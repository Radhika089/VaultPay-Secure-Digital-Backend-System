import accountModel from "../models/account.model.js";

export async function createAccount(req, res) {
  try {
    const user = req.user;
    const existingUser = await accountModel.findOne({ user: user._id });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Account already exists.",
      });
    }

    const account = await accountModel.create({
      user: user._id,
    });

    res.status(201).json({
      success: true,
      account,
      message: "Account created Successfully!",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getUserAccount(req, res) {
  const accounts = await accountModel.find({ user: req.user._id });

  return res.status(200).json({
    success: true,
    message: "All accounts fetched",
    accounts,
  });
}

export async function getAccountBalance(req, res) {
  const { accountId } = req.params;

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(404).json({
      success: false,
      message: "Account not found!",
    });
  }

  const balance = await account.getBalance();

  res.status(200).json({
    success: true,
    accountId: accountId._id,
    balance: balance,
  });
}
