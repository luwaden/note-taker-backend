import { Schema, model, Document, CallbackError } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../utils/user.interface";

const userschema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
  isVerified: { type: Boolean, required: false, default: false },
  phoneNumber: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

userschema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    // console.log(hashedPassword);

    user.password = hashedPassword;
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

const User = model<IUser>("User", userschema);
export default User;
