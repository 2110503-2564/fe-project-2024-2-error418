"use server";

import { z } from "zod";
import dbConnect from "./dbConnect";
import Restaurant, { RestaurantDB } from "./models/Restaurant";
import { auth } from "@/auth";
import User from "./models/User";

export async function getRestaurants(
  options: { select?: string; sort?: string; page?: string; limit?: string } = {}
) {
  await dbConnect();
  try {
    let query = Restaurant.find();
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

    const restaurants = await query;
    if (restaurants) {
      return {
        success: true,
        pagination,
        count: restaurants.length,
        data: restaurants as RestaurantDB[],
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

export async function createRestaurant(formState: unknown, formData: FormData) {
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
        const restaurant = await Restaurant.insertOne({ ...validatedFields.data, owner: user.id });
        if (restaurant) {
          await User.findByIdAndUpdate(user.id, { $addToSet: { restaurantOwner: restaurant.id } });
          return { success: true };
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

async function fetchRestaurant(id: string) {
  try {
    await dbConnect();
    return await Restaurant.findById(id);
  } catch (err) {
    console.error(err);
  }
}

export async function getRestaurant(id: string) {
  const restaurant = await fetchRestaurant(id);
  if (restaurant) {
    return { success: true, data: restaurant as RestaurantDB };
  }
  return { success: false };
}

export async function updateRestaurant(formState: unknown, formData: FormData) {
  try {
    const user = (await auth())?.user;
    const restaurantID = (formData.get("restaurantID") as string) || null;
    if (!user || !restaurantID) return { success: false };
    const restaurant = await fetchRestaurant(restaurantID);
    const validatedFields = RestaurantForm.safeParse({
      name: formData.get("name"),
      address: formData.get("address"),
      district: formData.get("district"),
      province: formData.get("province"),
      postalcode: formData.get("postalcode"),
      region: formData.get("region"),
      phone: formData.get("phone"),
    });
    if (restaurant && restaurant.owner.toString() == user.id) {
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        restaurantID,
        validatedFields.data,
        { new: true, runValidators: true }
      );
      return { success: true, data: updatedRestaurant as RestaurantDB };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}
