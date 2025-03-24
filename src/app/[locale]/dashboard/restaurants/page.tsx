import { auth } from "@/auth";
import { getRestaurants } from "@/db/restaurants";
import { redirect } from "next/navigation";
import MyRestaurantSearch from "@/components/MyRestaurantSearch";
export default async function MyRestaurants() {
  const session = await auth();
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent("/dashboard/restaurants")}`);
  }
  const restaurants = await getRestaurants({}, { owner: session.user.id });
  if (!restaurants.success) {
    return <main>Cannot fetch data</main>;
  }

  return (
    <main>
      <h1 className="pt-4">My Restaurants</h1>
      <MyRestaurantSearch restaurants={restaurants.data} />
    </main>
  );
}
