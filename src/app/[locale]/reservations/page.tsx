import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { editReservation, getUserReservations, PopulatedReservationJSON } from "@/db/reservations";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Button } from "@mui/material";
import { revalidatePath } from "next/cache";

export default async function Reservations() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const reservations = await getUserReservations();
  if (!reservations.success) {
    return <main>Cannot fetch data</main>;
  }
  return (
    <main>
      <h1>My Reservations</h1>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(16.5rem,1fr))] justify-items-center gap-8 py-4">
        {reservations.data.map((e) => (
          <li key={e.id}>
            <Card {...e}></Card>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Card({ restaurant, reserveDate, approvalStatus, id }: PopulatedReservationJSON) {
  return (
    <div className="h-[22rem] w-[16.5rem] rounded-lg bg-white p-1 shadow-lg hover:bg-neutral-200 hover:shadow-2xl">
      <Link href={`/reservations/${id}`}>
        <div className="h-[50%]">
          <Image
            className="pointer-events-none h-full w-full rounded-sm object-cover object-center select-none"
            src="/img/restaurant.jpg"
            alt={restaurant.name}
            width={0}
            height={0}
            sizes="100vw"
            priority
          />
        </div>
      </Link>
      <div className="flex h-[35%] flex-col overflow-auto">
        <h2 className="pt-4 pb-2 text-[1rem] font-bold">{restaurant.name}</h2>
        <span>{reserveDate.toLocaleString()}</span>
        <span>{approvalStatus}</span>
      </div>
      <div className="z-10 flex h-[15%] flex-col overflow-auto">
        {(approvalStatus == "pending" || approvalStatus == "approved") && (
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
  );
}
