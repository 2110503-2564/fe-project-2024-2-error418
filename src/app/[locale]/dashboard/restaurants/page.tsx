import { auth } from "@/auth";
import { getRestaurants } from "@/db/restaurants";
import { redirect } from "next/navigation";
import MyRestaurantSearch from "@/components/MyRestaurantSearch";
import { getTranslations } from "next-intl/server";
import { getUserData } from "@/db/auth";
export default async function MyRestaurants() {
  const session = await auth();
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent("/dashboard/restaurants")}`);
  }
  const user = await getUserData(session.user.id);
  const restaurantAdminID = user.success ? user.data.restaurantAdmin : [];
  const restaurants = await getRestaurants(
    {},
    { $or: [{ owner: session.user.id }, { _id: { $in: restaurantAdminID } }] }
  );
  if (!restaurants.success) {
    return <main>Cannot fetch data</main>;
  }

  const text = await getTranslations("TopNav");

  return (
    <main>
      <h1 className="pt-4">{text("my-restaurant")}</h1>
      <MyRestaurantSearch restaurants={restaurants.data} />
    </main>
  );
}
