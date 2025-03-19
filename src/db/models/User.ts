import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms from "ms";

export type UserDB = {
  name: string;
  phone: string;
  email: string;
  password: string;
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  restaurantOwner: mongoose.Types.ObjectId[];
  restaurantAdmin: mongoose.Types.ObjectId[];
};

type UserModel = UserDB & mongoose.Document;

const UserSchema = new mongoose.Schema<UserModel>({
  name: { type: String, required: [true, "Please add a name"] },
  phone: { type: String, required: [true, "Please add a phone number"] },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { type: Date, default: Date.now },
  // User 1-n Restaurant
  restaurantOwner: [{ type: mongoose.Schema.ObjectId, ref: "Restaurant" }],
  // User n-n Restaurant
  restaurantAdmin: [{ type: mongoose.Schema.ObjectId, ref: "Restaurant" }],
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: process.env.JWT_EXPIRE as ms.StringValue,
  });
};

UserSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model<UserModel>("User", UserSchema);
