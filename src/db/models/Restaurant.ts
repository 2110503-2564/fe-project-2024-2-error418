import mongoose from "mongoose";

export type RestaurantJSON = {
  id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  region: string;
  phone?: string;
  createdAt: Date;
  owner: string;
  admin: string[];
};

export type RestaurantDB = {
  _id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  region: string;
  phone?: string;
  createdAt: Date;
  owner: mongoose.Types.ObjectId;
  admin: mongoose.Types.ObjectId[];
};

const RestaurantSchema = new mongoose.Schema<RestaurantDB>({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Restaurant name can not be more than 50 characters"],
  },
  address: { type: String, required: [true, "Please add an address"] },
  district: { type: String, required: [true, "Please add a district"] },
  province: { type: String, required: [true, "Please add a province"] },
  postalcode: {
    type: String,
    required: [true, "Please add a postalcode"],
    maxlength: [5, "Postal Code can not be more than 5 digits"],
  },
  region: { type: String, required: [true, "Please add a region"] },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  // User 1-n Restaurant
  owner: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  // User n-n Restaurant
  admin: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

const createModel = () => mongoose.model<RestaurantDB>("Restaurant", RestaurantSchema);

export default (mongoose.models.Restaurant as ReturnType<typeof createModel>) || createModel();
