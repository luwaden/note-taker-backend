import express, { Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
import cors from "cors";
import noteRouter from "./routes/note.routes";
import authRouter from "./routes/auth.routes";
import connectDB from "./config/db";

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(express.json());
app.use("/api", noteRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
});
