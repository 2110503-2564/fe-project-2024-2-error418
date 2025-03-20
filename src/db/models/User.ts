import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface UserDB {
  name: string;
  phone: string;
  email: string;
  password: string;
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  restaurantOwner: mongoose.Types.ObjectId[];
  restaurantAdmin: mongoose.Types.ObjectId[];
}

const UserSchema = new mongoose.Schema<UserDB>({
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
  password: { type: String, required: true, minlength: 6, select: false },
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

const createModel = () => mongoose.model<UserDB>("User", UserSchema);

export default (mongoose.models.User as ReturnType<typeof createModel>) || createModel();
