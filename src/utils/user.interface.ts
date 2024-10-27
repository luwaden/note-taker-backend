import { model, Schema, Types, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  userName: string;
  phoneNumber?: number;
}
