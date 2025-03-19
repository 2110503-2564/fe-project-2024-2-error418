"use server";

import dbConnect from "./dbConnect";
import Restaurant, { RestaurantDB } from "./models/Restaurant";

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

    const restaurants = (await query) as RestaurantDB[];
    return { success: true, pagination, count: restaurants.length, data: restaurants };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}
