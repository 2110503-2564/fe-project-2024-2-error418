import { ReservationDB, ReservationJSON } from "./Reservation";
import { RestaurantDB, RestaurantJSON } from "./Restaurant";

export function clearRestaurantObjectID(restaurant: RestaurantDB | null): RestaurantJSON | null {
  if (!restaurant) return restaurant;
  return {
    id: restaurant._id.toString(),
    name: restaurant.name,
    address: restaurant.address,
    district: restaurant.district,
    province: restaurant.province,
    postalcode: restaurant.postalcode,
    region: restaurant.region,
    phone: restaurant.phone,
    createdAt: restaurant.createdAt,
    owner: restaurant.owner.toString(),
    admin: restaurant.admin.map((e) => e.toString()),
  };
}

export function clearReservationObjectID(
  reservation: ReservationDB | null
): ReservationJSON | null {
  if (!reservation) return null;
  return {
    id: reservation._id.toString(),
    reserveDate: reservation.reserveDate,
    user: reservation.user.toString(),
    restaurant: reservation.restaurant.toString(),
    personCount: reservation.personCount,
    approvalStatus: reservation.approvalStatus,
    paymentStatus: reservation.paymentStatus,
    createdAt: reservation.createdAt,
  };
}
