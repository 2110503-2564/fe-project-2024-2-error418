import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { deleteReservation, editReservation, getUserReservations } from "@/db/reservations";
import ReservationSearch from "@/components/ReservationSearch";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

async function cancelReservation(id: string) {
  "use server";
  await editReservation(id, "canceled");
  revalidatePath("/reservations");
}

async function deleteReservationAction(id: string) {
  "use server";
  await deleteReservation(id);
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

  const text = await getTranslations("Reservations");
  return (
    <main>
      <h1 className="pt-4">{text("title")}</h1>
      <ReservationSearch
        reservations={reservations.data}
        cancelReservation={cancelReservation}
        deleteReservation={deleteReservationAction}
      ></ReservationSearch>
    </main>
  );
}
