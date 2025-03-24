"use server";

import { auth } from "@/auth";
import dbConnect from "./dbConnect";
import Reservation from "./models/Reservation";
import mongoose from "mongoose";
import { RestaurantDB, RestaurantJSON } from "./models/Restaurant";
import { clearRestaurantObjectID } from "./models/utils";

type TopRestaurantDB = RestaurantDB & { count: number };
export type TopRestaurantJSON = RestaurantJSON & { count: number };

export async function getUserTopRestaurant(
  limit: number = 3
): Promise<{ success: true; data: TopRestaurantJSON[] } | { success: false }> {
  await dbConnect();
  try {
    const user = (await auth())?.user;
    if (user) {
      const mostReservedRestaurant = (await Reservation.aggregate([
        {
          $match: {
            user: mongoose.Types.ObjectId.createFromHexString(user.id),
            reserveDate: { $lt: new Date() },
          },
        },
        { $sortByCount: "$restaurant" },
        { $limit: limit },
        {
          $lookup: {
            from: "restaurants",
            localField: "_id",
            foreignField: "_id",
            as: "restaurant",
          },
        },
        {
          $replaceRoot: {
            newRoot: { $mergeObjects: [{ $arrayElemAt: ["$restaurant", 0] }, { count: "$count" }] },
          },
        },
      ])) as TopRestaurantDB[];
      return {
        success: true,
        data: mostReservedRestaurant.map((e) => ({
          ...(clearRestaurantObjectID(e) as RestaurantJSON),
          count: e.count,
        })),
      };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

export async function getApprovalStatus(
  restaurantID: string | undefined = undefined
): Promise<
  | {
      success: true;
      data:
        | {
            rejected?: number;
            pending?: number;
            canceled?: number;
            approved?: number;
            total: number;
          }
        | undefined;
    }
  | { success: false }
> {
  await dbConnect();
  try {
    const matchQuery: {
      reserveDate: { $lt: Date };
      user?: mongoose.Types.ObjectId;
      restaurant?: mongoose.Types.ObjectId;
    } = { reserveDate: { $lt: new Date() } };
    const user = (await auth())?.user;
    if (restaurantID) {
      matchQuery.restaurant = mongoose.Types.ObjectId.createFromHexString(restaurantID);
    } else if (user) {
      matchQuery.user = mongoose.Types.ObjectId.createFromHexString(user.id);
    }
    const statCount = await Reservation.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$approvalStatus", count: { $count: {} } } },
      {
        $group: {
          _id: null,
          items: { $push: { k: "$_id", v: "$count" } },
          total: { $sum: "$count" },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: [{ $arrayToObject: "$items" }, { total: "$total" }] },
        },
      },
    ]);
    return { success: true, data: statCount[0] };
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

export async function getFrequency(
  restaurantID: string
): Promise<{ success: true; data: { k: string; v: number }[] } | { success: false }> {
  await dbConnect();
  try {
    const matchQuery = {
      reserveDate: { $lt: new Date() },
      restaurant: mongoose.Types.ObjectId.createFromHexString(restaurantID),
    };
    const frequency = await Reservation.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            $dateFromParts: {
              year: 1,
              hour: { $hour: "$reserveDate" },
              minute: {
                $subtract: [
                  { $minute: "$reserveDate" },
                  { $mod: [{ $minute: "$reserveDate" }, 30] },
                ],
              },
            },
          },
          count: { $count: {} },
        },
      },
      {
        $densify: {
          field: "_id",
          range: {
            step: 30,
            unit: "minute",
            bounds: [new Date("0001-01-01T00:00:00.000Z"), new Date("0001-01-02T00:00:00.000Z")],
          },
        },
      },
      {
        $group: {
          _id: null,
          items: {
            $push: {
              k: { $dateToString: { date: "$_id", format: "%H:%M" } },
              v: { $ifNull: ["$count", "$count", 0] },
            },
          },
        },
      },
    ]);
    return { success: true, data: frequency[0].items };
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}
