import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRestaurantReservations } from "@/db/reservations";
import ReservationList from "./reservationList";
import { getTranslations } from "next-intl/server";

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

  const text = await getTranslations("ManageReservations");
  return (
    <main>
      <h1 className="py-4">{text("titel")}</h1>
      <ReservationList restaurantID={id} reservations={reservations} />
    </main>
  );
}
