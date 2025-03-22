"use server";

import { auth } from "@/auth";
import dbConnect from "./dbConnect";
import Reservation, { ReservationDB } from "./models/Reservation";
import Restaurant, { RestaurantDB } from "./models/Restaurant";
import mongoose from "mongoose";
import { z } from "zod";

export async function getUserReservations() {
  await dbConnect();
  try {
    const user = (await auth())?.user;
    if (user) {
      const reservations = await Reservation.find({ user: user.id }).populate({
        path: "restaurant",
      });
      return { success: true, count: reservations.length, data: reservations as ReservationDB[] };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

export async function getRestaurantReservations(restaurantID: string) {
  await dbConnect();
  try {
    const user = (await auth())?.user;
    if (!user) {
      return { success: false };
    }
    const restaurant = await Restaurant.findById(restaurantID);
    if (restaurant) {
      const queryOptions: { restaurant: string; user?: string } = { restaurant: restaurantID };
      if (!restaurant.admin.includes(new mongoose.Types.ObjectId(user.id))) {
        queryOptions.user = user.id;
      }
      const reservations = await Reservation.find(queryOptions);
      return {
        success: true,
        count: reservations.length,
        data: {
          restaurant: restaurant as RestaurantDB,
          reservations: reservations as ReservationDB[],
        },
      };
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
    if (!user) return { success: false };

    const existedAppointments = await Reservation.countDocuments({
      user: user.id,
      reserveDate: { $gt: new Date() },
    });
    const restaurant = await Restaurant.findById(validatedFields.data.restaurant);
    if (restaurant) {
      if (existedAppointments >= 3 && restaurant.owner.toString() != user.id) {
        return { success: false };
      }
      const reservation = await Reservation.insertOne({ ...validatedFields.data, user: user.id });
      if (reservation) {
        return { success: true };
      }
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

async function fetchReservation(id: string) {
  await dbConnect();
  try {
    return await Reservation.findById(id);
  } catch (err) {
    console.error(err);
  }
}

export async function getReservation(id: string) {
  const reservation = await fetchReservation(id);
  if (reservation) {
    return { success: true, data: reservation as ReservationDB };
  }
  return { success: false };
}
