import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { IUser } from "../utils/user.interface";

export interface RegisterRequestBody {
  email: string;
  password: string;
  userName: string;
  phoneNumber: string;
}

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, userName, phoneNumber } =
    req.body as RegisterRequestBody;
  if (!email || !password || !userName) {
    res.status(400).json({
      status: "400",
      error: "Bad request",
      message: "email, password and username are required",
    });
  }
  try {
    await User.create({ email, password, userName, phoneNumber });
    res.status(201).json({ message: "A new user successfully created" });
  } catch (error) {
    console.error(error);
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  let token: string = "",
    user: IUser | null = null;
  try {
    // Find user by email
    user = await User.findOne({ email });
    if (!user) {
      throw new Error("user does not exist");
    }
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("invalid password");
    }

    // Generate a JWT token for authentication
    token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "",
      { expiresIn: process.env.JWT_EXPIRE }
    );
  } catch (err) {
    // Catch any errors and return 500 respone
    throw new Error(`Error: ${err}`);
  }

  // Send success response with token
  res.status(200).json({
    error: false,
    data: {
      _id: user?._id,
      email: user?.email,
    },
    token,
    message: "Login successful",
  });
};
