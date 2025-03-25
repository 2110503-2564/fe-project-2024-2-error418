"use server";

import { z } from "zod";
import { auth } from "@/auth";
import dbConnect from "./dbConnect";
import { getRestaurant } from "./restaurants";
import Restaurant, { RestaurantDB, RestaurantJSON } from "./models/Restaurant";
import Reservation, { ReservationDB, ReservationJSON } from "./models/Reservation";
import { clearReservationObjectID, clearRestaurantObjectID } from "./models/utils";

type PopulatedReservationDB = Omit<ReservationDB, "restaurant"> & { restaurant: RestaurantDB };
export type PopulatedReservationJSON = Omit<ReservationJSON, "restaurant"> & {
  restaurant: RestaurantJSON;
};

function clearPopulatedObjectID(e: PopulatedReservationDB): PopulatedReservationJSON {
  return {
    id: e._id.toString(),
    reserveDate: e.reserveDate,
    user: e.user.toString(),
    personCount: e.personCount,
    approvalStatus: e.approvalStatus,
    paymentStatus: e.paymentStatus,
    createdAt: e.createdAt,
    restaurant: clearRestaurantObjectID(e.restaurant) as RestaurantJSON,
  };
}

export async function getUserReservations(): Promise<
  { success: true; count: number; data: PopulatedReservationJSON[] } | { success: false }
> {
  await dbConnect();
  try {
    const user = (await auth())?.user;
    if (user) {
      const reservations = (await Reservation.find({ user: user.id }).populate({
        path: "restaurant",
      })) as unknown as PopulatedReservationDB[] | null;
      if (reservations) {
        return {
          success: true,
          count: reservations.length,
          data: reservations.map((e) => clearPopulatedObjectID(e)),
        };
      }
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

export async function getRestaurantReservations(
  restaurantID: string
): Promise<
  | {
      success: true;
      count: number;
      data: { restaurant: RestaurantJSON; reservations: ReservationJSON[] };
    }
  | { success: false }
> {
  await dbConnect();
  try {
    const user = (await auth())?.user;
    if (!user) return { success: false };

    const restaurant = await getRestaurant(restaurantID);
    if (restaurant.success) {
      const queryOptions: { restaurant: string; user?: string } = { restaurant: restaurantID };
      if (restaurant.data.owner != user.id && !restaurant.data.admin.includes(user.id)) {
        return { success: false };
      }
      const reservations = (await Reservation.find(queryOptions)).map((e) =>
        clearReservationObjectID(e)
      );
      if (reservations) {
        return {
          success: true,
          count: reservations.length,
          data: { restaurant: restaurant.data, reservations: reservations as ReservationJSON[] },
        };
      }
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

const ReservationForm = z.object({
  reserveDate: z.string().datetime(),
  restaurant: z.string(),
  personCount: z.number(),
});

export async function createReservation(formState: unknown, formData: FormData) {
  await dbConnect();
  try {
    const validatedFields = ReservationForm.safeParse({
      reserveDate: formData.get("reserveDate"),
      restaurant: formData.get("restaurantID"),
      personCount: Number(formData.get("personCount")),
    });
    if (!validatedFields.success) return { success: false, errors: validatedFields.error };
    const user = (await auth())?.user;
    if (!user) return { success: false, message: "unauthorized" };

    const [existedAppointments, restaurant] = await Promise.all([
      Reservation.countDocuments({
        user: user.id,
        reserveDate: { $gt: new Date() },
        approvalStatus: { $in: ["pending", "approved"] },
      }),
      Restaurant.findById(validatedFields.data.restaurant),
    ]);

    if (restaurant) {
      if (existedAppointments >= 3 && restaurant.owner.toString() != user.id) {
        return { success: false, message: "reservations limit reached" };
      }
      const reservation = clearReservationObjectID(
        await Reservation.insertOne({ ...validatedFields.data, user: user.id })
      );
      if (reservation) return { success: true, data: reservation };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false, message: "error occured" };
}

async function fetchReservation(id: string): Promise<PopulatedReservationJSON | null> {
  await dbConnect();
  try {
    const reservation = clearPopulatedObjectID(
      (await Reservation.findById(id)
        .lean()
        .populate("restaurant")) as unknown as PopulatedReservationDB
    );
    return reservation;
  } catch (err) {
    console.error(err);
  }
  return null;
}

export async function getReservation(
  id: string
): Promise<{ success: true; data: PopulatedReservationJSON } | { success: false }> {
  const user = (await auth())?.user;
  if (!user) return { success: false };
  const reservation = await fetchReservation(id);
  if (
    reservation
    && (reservation.user == user.id
      || reservation.restaurant.owner == user.id
      || reservation.restaurant.admin.includes(user.id))
  ) {
    return { success: true, data: reservation };
  }
  return { success: false };
}

export async function editReservation(
  reservationID: string,
  approvalStatus: "pending" | "canceled" | "approved" | "rejected"
): Promise<{ success: true; data: PopulatedReservationJSON } | { success: false }> {
  try {
    const user = (await auth())?.user;
    if (!user) return { success: false };
    const reservation = await fetchReservation(reservationID);
    if (
      !reservation
      || reservation.approvalStatus == "canceled"
      || reservation.approvalStatus == "rejected"
    ) {
      return { success: false };
    }
    if (
      (reservation.user == user.id && reservation.approvalStatus == "pending")
      || ((reservation.restaurant.owner == user.id
        || reservation.restaurant.admin.includes(user.id))
        && reservation.approvalStatus == "approved")
    ) {
      const updatedReservation = clearPopulatedObjectID(
        (await Reservation.findByIdAndUpdate(
          reservationID,
          { approvalStatus },
          { new: true, runValidators: true }
        ).populate("restaurant")) as unknown as PopulatedReservationDB
      );
      if (updatedReservation) {
        return { success: true, data: updatedReservation };
      }
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

export async function deleteReservation(id: string) {
  await dbConnect();
  try {
    const user = (await auth())?.user;
    if (!user) return { success: false };
    const reservation = await fetchReservation(id);
    if (!reservation) return { success: false };
    const restaurant = await getRestaurant(id);
    if (
      restaurant.success
      && (reservation.user == user.id
        || restaurant.data.owner == user.id
        || restaurant.data.admin.includes(user.id))
    ) {
      await Reservation.deleteOne({ id });
      return { success: true };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}
