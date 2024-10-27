import { Schema, model, Document, CallbackError } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../utils/user.interface";

const userschema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
  phoneNumber: { type: String, required: false },
});

userschema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

const User = model<IUser>("User", userschema);
export default User;
