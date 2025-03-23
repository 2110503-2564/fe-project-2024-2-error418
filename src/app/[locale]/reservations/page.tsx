import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { editReservation, getUserReservations } from "@/db/reservations";
import ReservationSearch from "@/components/ReservationSearch";
import { revalidatePath } from "next/cache";

async function cancelReservation(id: string) {
  "use server";
  await editReservation(id, "canceled");
  revalidatePath("/reservations");
}

export default async function Reservations() {
  const session = await auth();
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent("/reservations")}`);
  }

  const reservations = await getUserReservations();
  if (!reservations.success) {
    return <main>Cannot fetch data</main>;
  }
  return (
    <main>
      <h1>My Reservations</h1>
      <ReservationSearch
        reservations={reservations.data}
        cancelReservation={cancelReservation}
      ></ReservationSearch>
    </main>
  );
}
