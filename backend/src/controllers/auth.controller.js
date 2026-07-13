import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../services/email.service.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await userModel.findOne({
      email,
    });

    if (existingUser) {
      return res.status(422).json({
        success: false,
        message: "Already Registered",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const token = createToken(user._id);

    res.cookie("token", token);

    res.status(201).json({
      success: true,
      message: "Registered Successfully!",
      user: {
        name: user.name,
        id: user._id,
        email: user.email,
      },
      token,
    });

    await sendRegistrationEmail(user.email, user.name);
  } catch (error) {
    console.log("Server Error", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = createToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Login Successfully!",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Server Error", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
