"use server";

import { auth } from "@/auth";
import dbConnect from "./dbConnect";
import Reservation from "./models/Reservation";

export async function getUserTopRestaurant(limit: number = 3) {
  await dbConnect();
  try {
    const user = (await auth())?.user;
    if (user) {
      const mostReservedRestaurant = await Reservation.aggregate([
        { $match: { user: user.id, reserveDate: { $lt: new Date() } } },
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
      ]);
      return mostReservedRestaurant;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

export async function getApprovalStatus(restaurantID: string) {
  try {
    const matchQuery: { reserveDate: { $lt: Date }; user?: string; restaurant?: string } = {
      reserveDate: { $lt: new Date() },
    };
    const user = (await auth())?.user;
    if (user) {
      matchQuery.user = user.id;
    }
    if (restaurantID) {
      matchQuery.restaurant = restaurantID;
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
    return statCount[0];
  } catch (err) {
    console.error(err);
  }
  return null;
}

export async function getFrequency(restaurantID: string) {
  try {
    const matchQuery = { reserveDate: { $lt: new Date() }, restaurant: restaurantID };
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
      { $replaceRoot: { newRoot: { $arrayToObject: "$items" } } },
    ]);
    return frequency[0];
  } catch (err) {
    console.error(err);
  }
  return null;
}
