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
    redirect(`/login?returnTo=${encodeURIComponent("/reservations")}`);
  }
  const { id } = await params;
  const reservation = await getReservation(id);
  if (!reservation.success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-gray-700">Cannot fetch data</div>
      </main>
    );
  }
  const { data } = reservation;

  const reserveDate = new Date(data.reserveDate); // Convert to Date object

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-row gap-8">
          <div className="w-[50%]">
            <Image
              className="rounded shadow-md"
              src="/img/restaurant.jpg"
              alt={data.restaurant.name}
              width={600}
              height={400}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-3xl font-bold text-yellow-600">{data.restaurant.name}</h1>
            <div className="text-xl">
              <span>Reserved On: {reserveDate.toLocaleString()}</span>
              <br />
              <span>Person Count: {data.personCount}</span>
            </div>
            <div className="mt-6 flex gap-4">
              {user && (
                <Link href={`/restaurants/${data.restaurant.id}`}>
                  <Button
                    variant="contained"
                    className="rounded bg-yellow-500 px-4 py-2 font-bold text-white shadow-md hover:bg-yellow-700"
                  >
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
                  <Button
                    variant="contained"
                    className="rounded bg-red-500 px-4 py-2 font-bold text-white shadow-md hover:bg-red-700"
                    type="submit"
                  >
                    Cancel
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
