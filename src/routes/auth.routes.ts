import express, { Router, Request, Response, NextFunction } from "express";
import User from "../models/user.model";

import { userLogin, userRegister } from "../controllers/auth";

const router = Router();

interface LoginRequestBody {
  email: string;
  password: string;
}

router.post("/register", userRegister);

router.post("/login", userLogin);
export default router;
