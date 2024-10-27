import { model, Schema, Types, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
