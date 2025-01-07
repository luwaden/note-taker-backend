import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { IUser } from "../utils/user.interface";
import errorHandler from "../middleware/error.mw";
import sendMail from "../utils/sendEmail";
import { Error } from "mongoose";
import { log } from "console";

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

    // Create the new user
    const newUser = new User({
      email,
      password,
      userName,
      phoneNumber,
    });
    if (!newUser) {
      throw new Error("unable to register user");
    }

    const token = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.VERFIFY_EMAIL_JWT_EXPIRES,
      }
    );

    const message = `Click on the link below to verify your email:  \n http ://localhost:3000/api/v1/users/verify?token=${token}`;

    await newUser.save();
    await sendMail({
      email: newUser.email,
      subject: "Email verification",
      message,
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
      res
        .status(400)
        .json({ error: true, message: "invalid password or email" });
      return;
    }
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res
        .status(400)
        .json({ error: true, message: "Invalid password or email" });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
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

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.params.token;
  console.log(token);

  try {
    if (!token) {
      throw new Error("pls provide token");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("pls provide secret");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = (decoded as JwtPayload).email;
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
    if (!user) {
      throw new Error("user not found");
    }

    res.status(200).json({
      error: false,
      data: user,
      message: "Email verification successful",
    });
  } catch (error) {
    throw new Error(`unable to verify email`);
  }
};
