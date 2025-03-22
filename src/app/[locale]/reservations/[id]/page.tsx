import { getReservation } from "@/db/reservations";

export default async function Reservation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reservation = await getReservation(id);
  if (!reservation.success) {
    return <main>Cannot fetch data</main>;
  }
  return <main>{JSON.stringify(reservation)}</main>;
}
