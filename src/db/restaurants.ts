"use server";

import { z } from "zod";
import { auth } from "@/auth";
import dbConnect from "./dbConnect";
import User from "./models/User";
import Restaurant, { RestaurantJSON } from "./models/Restaurant";
import Reservation from "./models/Reservation";
import { clearRestaurantObjectID } from "./models/utils";

export async function getRestaurants(
  options: { select?: string; sort?: string; page?: string; limit?: string } = {}
): Promise<
  | {
      success: true;
      pagination: { limit: number; prev?: number; next?: number };
      count: number;
      data: RestaurantJSON[];
    }
  | { success: false }
> {
  await dbConnect();
  try {
    let query = Restaurant.find().lean();
    if (options.select) {
      const fields = options.select.split(",").join(" ");
      query = query.select(fields);
    }
    if (options.sort) {
      const fields = options.sort.split(",").join(" ");
      query = query.sort(fields);
    }

    // Might change later
    const page = parseInt(options.page || "1", 10) || 1;
    const limit = parseInt(options.limit || "25", 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalIndex = await Restaurant.countDocuments();
    query = query.skip(startIndex).limit(limit);
    const pagination: { limit: number; prev?: number; next?: number } = {
      limit,
      prev: startIndex > 0 ? page - 1 : undefined,
      next: endIndex < totalIndex ? page + 1 : undefined,
    };

    const restaurants = (await query).map((restaurant) => clearRestaurantObjectID(restaurant));
    if (restaurants) {
      return {
        success: true,
        pagination,
        count: restaurants.length,
        data: restaurants as RestaurantJSON[],
      };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

const RestaurantForm = z.object({
  name: z.string(),
  address: z.string(),
  district: z.string(),
  province: z.string(),
  postalcode: z.string(),
  region: z.string(),
  phone: z.string(),
});

export async function createRestaurant(
  formState: unknown,
  formData: FormData
): Promise<{ success: true; restaurant: RestaurantJSON } | { success: false }> {
  try {
    const user = (await auth())?.user;
    if (user) {
      const validatedFields = RestaurantForm.safeParse({
        name: formData.get("name"),
        address: formData.get("address"),
        district: formData.get("district"),
        province: formData.get("province"),
        postalcode: formData.get("postalcode"),
        region: formData.get("region"),
        phone: formData.get("phone"),
      });
      if (validatedFields.success) {
        await dbConnect();
        const restaurant = clearRestaurantObjectID(
          await Restaurant.insertOne({ ...validatedFields.data, owner: user.id })
        );
        if (restaurant) {
          await User.findByIdAndUpdate(user.id, { $addToSet: { restaurantOwner: restaurant.id } });
          return { success: true, restaurant: restaurant };
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

async function fetchRestaurant(id: string): Promise<RestaurantJSON | null> {
  try {
    await dbConnect();
    const restaurant = clearRestaurantObjectID(await Restaurant.findById(id).lean());
    return restaurant;
  } catch (err) {
    console.error(err);
  }
  return null;
}

export async function getRestaurant(
  id: string
): Promise<{ success: true; data: RestaurantJSON } | { success: false }> {
  const restaurant = await fetchRestaurant(id);
  if (restaurant) {
    return { success: true, data: restaurant };
  }
  return { success: false };
}

export async function editRestaurant(
  formState: unknown,
  formData: FormData
): Promise<{ success: true; data: RestaurantJSON } | { success: false }> {
  try {
    const user = (await auth())?.user;
    const restaurantID = (formData.get("restaurantID") as string) || null;
    if (!user || !restaurantID) return { success: false };

    const restaurant = await fetchRestaurant(restaurantID);
    if (restaurant && restaurant.owner == user.id) {
      const validatedFields = RestaurantForm.safeParse({
        name: formData.get("name"),
        address: formData.get("address"),
        district: formData.get("district"),
        province: formData.get("province"),
        postalcode: formData.get("postalcode"),
        region: formData.get("region"),
        phone: formData.get("phone"),
      });
      const updatedRestaurant = clearRestaurantObjectID(
        await Restaurant.findByIdAndUpdate(restaurantID, validatedFields.data, {
          new: true,
          runValidators: true,
        })
      );
      if (updatedRestaurant) return { success: true, data: updatedRestaurant };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

export async function deleteRestaurant(id: string) {
  await dbConnect();
  try {
    const user = (await auth())?.user;
    if (!user) return { success: false };
    const restaurant = await fetchRestaurant(id);
    if (restaurant && restaurant.owner == user.id) {
      await Promise.all([
        User.findByIdAndUpdate(user.id, { $pull: { restaurantOwner: id } }),
        User.updateMany({}, { $pull: { restaurantAdmin: id } }),
        Reservation.deleteMany({ restaurant: id }),
        Restaurant.findByIdAndDelete(id),
      ]);
      return { success: true };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}
