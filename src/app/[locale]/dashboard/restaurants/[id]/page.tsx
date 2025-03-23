import { redirect } from "next/navigation";
import { BarChart } from "@mui/x-charts/BarChart";
import { auth } from "@/auth";
import { getApprovalStatus, getFrequency } from "@/db/dashboard";

export default async function RestaurantDashboard({ params }: { params: Promise<{ id: string }> }) {
  const user = (await auth())?.user;
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const [approvalStatus, frequency] = await Promise.all([getApprovalStatus(id), getFrequency(id)]);
  console.log(approvalStatus);

  return (
    <main>
      <h1>Restaurant Dashboard</h1>
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
          : <div className="text-center">No past Reservation for this restaurant</div>
        : <span>Cannot fetch data</span>}
      </section>

      <section>
        <h2 className="text-center text-xl font-bold">Reservation Frequency</h2>
        {frequency.success ?
          <BarChart
            height={600}
            dataset={frequency.data}
            xAxis={[{ scaleType: "band", dataKey: "k" }]}
            series={[{ dataKey: "v" }]}
          />
        : <span>No past Reservation for this restaurant</span>}
      </section>
    </main>
  );
}
