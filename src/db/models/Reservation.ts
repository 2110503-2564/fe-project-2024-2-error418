import mongoose from "mongoose";

type ReservationDB = {
  reserveDate: Date;
  user: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  personCount: number;
  approvalStatus: "pending" | "canceled" | "approved" | "rejected";
  paymentStatus: boolean;
  createdAt: Date;
};

const ReservationSchema = new mongoose.Schema<ReservationDB>({
  reserveDate: { type: Date, required: true },
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.ObjectId, ref: "Restaurant", required: true },
  personCount: { type: Number, required: true },
  approvalStatus: {
    type: String,
    enum: ["pending", "canceled", "approved", "rejected"],
    default: "pending",
  },
  paymentStatus: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const createModel = () => mongoose.model<ReservationDB>("Reservation", ReservationSchema);

export default (mongoose.models.Reservation as ReturnType<typeof createModel>) || createModel();
