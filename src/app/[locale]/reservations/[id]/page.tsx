import { auth } from "@/auth";
import { editReservation, getReservation } from "@/db/reservations";
import { Link } from "@/i18n/navigation";
import { Button } from "@mui/material";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Reservation({ params }: { params: Promise<{ id: string }> }) {
  const user = (await auth())?.user;
  if (!user) {
    redirect("/login");
  }
  const { id } = await params;
  const reservation = await getReservation(id);
  if (!reservation.success) {
    return <main>Cannot fetch data</main>;
  }
  const { data } = reservation;
  return (
    <main>
      <div className="flex flex-row gap-4 p-4">
        <Image
          className="w-[50%] rounded"
          src="/img/restaurant.jpg"
          alt={data.restaurant.name}
          width={0}
          height={0}
          sizes="50vw"
          priority
        />
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-bold">{data.restaurant.name}</h1>
          <span>Reserved On: {data.reserveDate.toLocaleString()}</span>
          <span>Person Count: {data.personCount}</span>
          <div className="mt-4 flex gap-4">
            {user && (
              <Link href={`/restaurants/${data.restaurant.id}`}>
                <Button variant="contained" type="button">
                  View Restaurant
                </Button>
              </Link>
            )}
            {(data.approvalStatus == "pending" || data.approvalStatus == "approved") && (
              <form
                action={async () => {
                  "use server";
                  await editReservation(id, "canceled");
                  revalidatePath("/reservations");
                }}
              >
                <Button variant="contained" type="submit">
                  Cancel
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
