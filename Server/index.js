import express from "express";
import "dotenv/config";
import { connectDB } from "./db/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    app.on("error", (error) => {
      console.log("ERROR :", error);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection Failed", err);
  });
