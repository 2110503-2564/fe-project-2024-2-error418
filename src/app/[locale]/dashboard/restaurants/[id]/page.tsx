import { redirect } from "next/navigation";
import { BarChart } from "@mui/x-charts/BarChart";
import { auth } from "@/auth";
import { getApprovalStatus, getFrequency } from "@/db/dashboard";
import { getTranslations } from "next-intl/server";
import { Button } from "@mui/material";
import { getRestaurant } from "@/db/restaurants";

export default async function RestaurantDashboard({ params }: { params: Promise<{ id: string }> }) {
  const user = (await auth())?.user;
  if (!user) {
    redirect(`/login?returnTo=${encodeURIComponent("/dashboard/restaurants")}`);
  }

  const { id } = await params;
  const restaurant = await getRestaurant(id);
  if (restaurant.success && restaurant.data.owner != user.id) {
    return redirect(`/dashboard/restaurants/${id}/reservations`);
  }
  const [approvalStatus, frequency] = await Promise.all([getApprovalStatus(id), getFrequency(id)]);
  console.log(approvalStatus);

  const text = await getTranslations("RestaurantDashboard");
  const statusText = await getTranslations("Status");
  const btnText = await getTranslations("Button");

  return (
    <main>
      <section className="p-8">
        <div className="rounded-lg border-2 shadow-xl">
          <h1>{text("title")}</h1>
          <h2 className="mb-4 text-center text-xl font-bold text-yellow-600">{text("detail")}</h2>
          {approvalStatus.success ?
            approvalStatus.data ?
              <div className="mx-auto flex w-fit flex-col items-center gap-2 py-2">
                <div className="flex flex-row gap-10">
                  <div className="flex flex-row font-bold">
                    <div className="mr-[5px] h-[35px] w-[130px] rounded-full bg-green-600 pt-[6px] text-center">
                      {statusText("approved")}
                    </div>
                    <div className="pt-[6px]">: {approvalStatus.data.approved || 0}</div>
                  </div>
                  <div className="flex flex-row font-bold">
                    <div className="mr-[5px] h-[35px] w-[130px] rounded-full bg-yellow-600 pt-[6px] text-center">
                      {statusText("pending")}
                    </div>
                    <div className="pt-[6px]">: {approvalStatus.data.pending || 0}</div>
                  </div>
                  <div className="flex flex-row font-bold">
                    <div className="mr-[5px] h-[35px] w-[130px] rounded-full bg-red-600 pt-[6px] text-center">
                      {statusText("rejected")}
                    </div>
                    <div className="pt-[6px]">: {approvalStatus.data.rejected || 0}</div>
                  </div>
                  <div className="flex flex-row font-bold">
                    <div className="mr-[5px] h-[35px] w-[130px] rounded-full bg-red-600 pt-[6px] text-center">
                      {statusText("canceled")}
                    </div>
                    <div className="pt-[6px]">: {approvalStatus.data.canceled || 0}</div>
                  </div>
                </div>
                <div className="mt-5 flex flex-row font-bold">
                  <div className="mr-[5px] h-[35px] w-[130px] rounded-full bg-[var(--cardhoverbg)] pt-[6px] text-center">
                    {statusText("total")}
                  </div>
                  <div className="pt-[6px]">: {approvalStatus.data.total || 0}</div>
                </div>
                <div className="mt-5 mb-6 flex flex-row font-bold">
                  <Button variant="contained" href={`/dashboard/restaurants/${id}/reservations`}>
                    {btnText("management")}
                  </Button>
                </div>
              </div>
            : <div className="text-center">{text("notfound")}</div>
          : <span>Cannot fetch data</span>}
        </div>
      </section>

      <section className="rounded-lg bg-yellow-50 p-6 shadow-xl">
        <h2 className="mb-4 text-center text-xl font-bold text-black">{text("graph-title")}</h2>
        {frequency.success ?
          <BarChart
            height={600}
            dataset={frequency.data}
            xAxis={[{ scaleType: "band", dataKey: "k" }]}
            series={[{ dataKey: "v", label: text("dataName"), color: "#FCD34D" }]}
          />
        : <span>{text("notfound")}</span>}
      </section>
    </main>
  );
}
