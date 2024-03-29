import express from "express";
import "dotenv/config"; 
import { connectDB } from "./db/index.js";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());

import rootRouter from "./routes/index.js";
app.use("/api", rootRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/Client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Client", "dist", "index.html"));
});

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
