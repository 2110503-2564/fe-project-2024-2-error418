import { auth } from "@/auth";
import { getRestaurants } from "@/db/restaurants";
import { redirect } from "next/navigation";
import RestaurantSearch from "@/components/RestaurantSearch";

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
      <h1>My Restaurants</h1>
      <RestaurantSearch restaurants={restaurants.data} />
    </main>
  );
}
