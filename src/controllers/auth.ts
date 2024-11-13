import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { IUser } from "../utils/user.interface";

export interface RegisterRequestBody {
  email: string;
  password: string;
  userName: string;
  phoneNumber: number;
}

export const userRegister: RequestHandler = async (
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
      message: "email, password, and username are required",
    });
    return;
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        error: true,
        message:
          "A user with this email already exists. Please log in or use a different email.",
      });
      return;
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    await User.create({
      email,
      password,
      userName,
      phoneNumber,
    });

    res.status(201).json({
      message: "A new user successfully created",
      data: { email, userName },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const userLogin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  let token = "";
  let user: IUser | null = null;

  try {
    // Check for the JWT_SECRET environment variable
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      res
        .status(500)
        .json({ error: true, message: "JWT_SECRET is not defined" });
      return;
    }
    // Find user by email
    user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: true, message: "User does not exist" });
      return;
    }
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log(user.password);
    // console.log(password);
    // console.log(isPasswordValid);

    if (!isPasswordValid) {
      res.status(400).json({ error: true, message: "Invalid password" });
      return;
    }

    // Generate a JWT token
    token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.status(200).json({
      error: false,
      data: token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
