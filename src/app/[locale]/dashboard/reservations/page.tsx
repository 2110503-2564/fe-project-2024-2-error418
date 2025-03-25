import { auth } from "@/auth";
import { getApprovalStatus, getUserTopRestaurant, TopRestaurantJSON } from "@/db/dashboard";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
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

  const text = await getTranslations("ReservationDashboard");
  const statusText = await getTranslations("Status");
  return (
    <main>
      <section className="mb-8 rounded-b-lg pt-4 pb-6 shadow-xl outline-2">
        <h1>{text("title")}</h1>
        <h2 className="mb-4 text-center text-xl font-bold text-yellow-600">{text("detail")}</h2>
        {approvalStatus.success ?
          approvalStatus.data ?
            <div className="mx-auto flex w-fit flex-col gap-2 py-2 items-center">
              <div className="flex flex-row gap-10">
                <div className="font-bold flex flex-row">
                  <div className="mr-[5px] h-[35px] w-[130px] pt-[6px] rounded-full bg-green-600 text-center">
                    {statusText("approved")}
                  </div>
                  <div className="pt-[6px]">
                    : {approvalStatus.data.approved || 0}
                  </div>
                </div>
                <div className="font-bold flex flex-row">
                  <div className="mr-[5px] h-[35px] w-[130px] pt-[6px] rounded-full bg-yellow-600 text-center">
                    {statusText("pending")}
                  </div>
                  <div className="pt-[6px]">
                    : {approvalStatus.data.pending || 0}
                  </div>
                </div>
                <div className="font-bold flex flex-row">
                  <div className="mr-[5px] h-[35px] w-[130px] pt-[6px] rounded-full bg-red-600 text-center">
                    {statusText("rejected")}
                  </div>
                  <div className="pt-[6px]">
                    : {approvalStatus.data.rejected || 0}
                  </div>
                </div>
                <div className="font-bold flex flex-row">
                  <div className="mr-[5px] h-[35px] w-[130px] pt-[6px] rounded-full bg-red-600 text-center">
                   {statusText("canceled")}
                  </div>
                  <div className="pt-[6px]">
                    : {approvalStatus.data.canceled || 0}
                  </div>
                </div>
              </div>

              <div className="font-bold mt-5 flex flex-row">
                <div className="mr-[5px] h-[35px] w-[130px] pt-[6px] rounded-full bg-[var(--cardhoverbg)] text-center">
                  {statusText("total")}
                </div>
                <div className="pt-[6px]">
                  : {approvalStatus.data.total || 0}
                </div>
              </div>
            </div>
          : <div className="text-center">{text("notfound")}</div>
        : <span>Cannot fetch data</span>}
      </section>

      <section>
        <h2 className="mb-4 text-center text-xl font-bold">{text("sub-title")}</h2>
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
        : <span>{text("notfound")}</span>}
      </section>
    </main>
  );
}

function Card({ count, name, address, region }: TopRestaurantJSON) {

  const text = useTranslations("ReservationDashboard");
  return (
    <div className="h-[22rem] w-[16.5rem] rounded-lg border border-[var(--cardborder)] bg-[var(--cardbg)] p-1 shadow-lg hover:bg-[var(--cardhoverbg)] hover:shadow-2xl hover:shadow-(color:--shadow)">
      <div className="h-[65%]">
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
      <div className="ml-3 flex h-[35%] flex-col overflow-auto">
        <h2 className="pt-4 pb-2 text-[1rem] font-bold">{name}</h2>
        <span>{address}</span>
        <span>{region}</span>
        <span className="font-bold">{text("total-reservation")}: {count}</span>
      </div>
    </div>
  );
}
