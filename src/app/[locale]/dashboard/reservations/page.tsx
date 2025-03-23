import { auth } from "@/auth";
import { getUserTopRestaurant } from "@/db/dashboard";
import { redirect } from "next/navigation";

export default async function ReservationDashboard() {
  const user = (await auth())?.user;
  if (!user) {
    redirect("/login");
  }

  const userTopRestaurant = await getUserTopRestaurant();

  return (
    <main>
      {userTopRestaurant ?
        <div></div>
      : <span>No data</span>}
    </main>
  );
}
