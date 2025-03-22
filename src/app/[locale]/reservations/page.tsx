import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserReservations } from "@/db/reservations";

export default async function Reservations() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const reservations = await getUserReservations();
  if (!reservations.success) {
    return <main>Cannot fetch data</main>;
  }
  return <main>{JSON.stringify(reservations)}</main>;
}
