import mongoose from "mongoose";

export default async function connectDb() {
  // console.log(process.env.MONGO_URI.replace(/\/\/.*:.*@/, "//***:***@"));
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch((error) => {
      console.log("Error connecting to db", error);
      process.exit(1);
    });
}
