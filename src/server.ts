import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import noteRouter from "./routes/note.routes";
import authRouter from "./routes/auth.routes";
import connectDB from "./config/db";
import errorHandler from "./middleware/error.mw";

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", noteRouter);
app.use("/auth", authRouter);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
});
