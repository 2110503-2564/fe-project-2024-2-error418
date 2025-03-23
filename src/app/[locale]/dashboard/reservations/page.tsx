import { auth } from "@/auth";
import { getApprovalStatus, getUserTopRestaurant, TopRestaurantJSON } from "@/db/dashboard";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ReservationDashboard() {
  const user = (await auth())?.user;
  if (!user) {
    redirect(`/login?returnTo=${encodeURIComponent("/dashboard/reservations")}`);
  }

  const [approvalStatus, userTopRestaurant] = await Promise.all([
    getApprovalStatus(),
    getUserTopRestaurant(),
  ]);
  return (
    <main>
      <h1>Reservation Dashboard</h1>
      <section>
        <h2 className="text-center text-xl font-bold">Past Approval Status</h2>
        {approvalStatus.success ?
          approvalStatus.data ?
            <div className="mx-auto flex w-fit flex-col gap-2 py-2">
              <span>Canceled: {approvalStatus.data.canceled || 0}</span>
              <span>Pending: {approvalStatus.data.pending || 0}</span>
              <span>Rejected: {approvalStatus.data.rejected || 0}</span>
              <span>Approved: {approvalStatus.data.approved || 0}</span>
              <span>Total: {approvalStatus.data.total || 0}</span>
            </div>
          : <div className="text-center">You dont have any past Reservation</div>
        : <span>Cannot fetch data</span>}
      </section>

      <section>
        <h2 className="text-center text-xl font-bold">Top Restaurant</h2>
        {userTopRestaurant.success ?
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(16.5rem,1fr))] justify-items-center gap-8 py-4">
            {userTopRestaurant.data.map((e) => (
              <li key={e.id}>
                <Link href={`/restaurants/${e.id}`}>
                  <Card {...e}></Card>
                </Link>
              </li>
            ))}
          </ul>
        : <span>No data</span>}
      </section>
    </main>
  );
}

function Card({ count, name, address, region }: TopRestaurantJSON) {
  return (
    <div className="h-[22rem] w-[16.5rem] rounded-lg bg-white p-1 shadow-lg hover:bg-neutral-200 hover:shadow-2xl">
      <div className="h-[67%]">
        <Image
          className="pointer-events-none h-full w-auto rounded-sm object-cover object-center select-none"
          src="/img/restaurant.jpg"
          alt={name}
          width={0}
          height={0}
          sizes="100vw"
          priority
        />
      </div>
      <div className="flex h-[33%] flex-col overflow-auto">
        <h3 className="pt-4 pb-2 text-[1rem] font-bold">{name}</h3>
        <span>{address}</span>
        <span>{region}</span>
        <span className="font-bold">Total Reservation: {count}</span>
      </div>
    </div>
  );
}
