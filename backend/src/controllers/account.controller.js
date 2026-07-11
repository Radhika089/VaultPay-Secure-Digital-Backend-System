import accountModel from "../models/account.model.js";

export async function createAccount(req, res) {
  try {
    const existingUser = await accountModel.findOne({ user: user._id });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: "Account already exists.",
      });
    }

    const user = req.user;

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
