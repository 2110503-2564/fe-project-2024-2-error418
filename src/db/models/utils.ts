import { ReservationDB, ReservationJSON } from "./Reservation";
import { RestaurantDB, RestaurantJSON } from "./Restaurant";
import { UserDB, UserJSON } from "./User";

export function clearUserObjectID(user: UserDB | null): UserJSON | null {
  if (!user) return user;
  return {
    name: user.name,
    phone: user.phone,
    email: user.email,
    password: user.password,
    createdAt: user.createdAt,
    resetPasswordToken: user.resetPasswordToken,
    resetPasswordExpire: user.resetPasswordExpire,
    restaurantOwner: user.restaurantOwner.map((e) => e.toString()),
    restaurantAdmin: user.restaurantAdmin.map((e) => e.toString()),
  };
}

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
