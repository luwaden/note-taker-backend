import express, { Router, Request, Response, NextFunction } from "express";
import User from "../models/user.model";

import { userLogin, userRegister, verifyEmail } from "../controllers/auth";
import authMiddleware from "../middleware/authorization.mw";

const router = Router();

interface LoginRequestBody {
  email: string;
  password: string;
}

router.post("/register", userRegister);

router.post("/login", authMiddleware, userLogin);
router.get("/verify-email/:token", verifyEmail);
export default router;
