import dotenv from "dotenv";
dotenv.config();
import connectDb from "./src/config/db.js";
import app from "./src/app.js";

connectDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running at post 3000");
});
