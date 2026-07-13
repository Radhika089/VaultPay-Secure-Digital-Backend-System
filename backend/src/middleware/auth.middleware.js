import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "User must be logged In!",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unauthorized access, token is invalid!",
    });
  }
}

export async function authSystemUserMiddleware(req, res, next) {
  // console.log("Authorization:", req.headers.authorization);
  // console.log("Cookies:", req.cookies);
  const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized access, token is missing",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId).select("+systemUser");
    if (!user || !user.systemUser) {
      return res.status(403).json({
        success: false,
        message: "Forbidden Access, not a system User.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unauthorized access, token is invalid!",
    });
  }
}
