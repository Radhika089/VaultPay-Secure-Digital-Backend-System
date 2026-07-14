import mongoose from "mongoose";

const tokenBlackListSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to backList"],
      unique: [true, "Token is already backListed"],
    },
  },
  {
    timestamps: true,
  },
);

tokenBlackListSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 3,
  },
);

const tokenBackListModel =
  mongoose.models.tokenBlackList ||
  mongoose.model("tokenBlackList", tokenBlackListSchema);

export default tokenBackListModel;
