import { Schema, model, Document, CallbackError } from "mongoose";
import { INote } from "../utils/note.interface";

const noteSchema = new Schema<INote>({
  title: { type: String },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Note = model<INote>("Note", noteSchema);
export default Note;