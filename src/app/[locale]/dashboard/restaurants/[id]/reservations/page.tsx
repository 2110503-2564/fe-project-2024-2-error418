import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRestaurantReservations } from "@/db/reservations";
import ReservationList from "./reservationList";

export default async function Reservations({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent("/reservations")}`);
  }
  const { id } = await params;
  const result = await getRestaurantReservations(id);
  if (!result.success) return <main>Cannot fetch data</main>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { restaurant, reservations } = result.data;
  return (
    <main>
      <h1>Manage Reservations</h1>
      <ReservationList restaurantID={id} reservations={reservations} />
    </main>
  );
}
