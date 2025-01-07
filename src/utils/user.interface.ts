import { model, Schema, Types, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  userName: string;
  isVerified: boolean;
  phoneNumber?: number;
  createdAt: Date;
}

export interface IMailOptions {
  message: string;
  subject: string;
  email: string;
}
