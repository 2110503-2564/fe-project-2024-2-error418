import { getRestaurants } from "@/db/restaurants";
import RestaurantSearch from "@/components/RestaurantSearch";

export default async function Restaurants() {
  const restaurants = await getRestaurants();

  if (!restaurants.success) {
    return <main>Cannot fetch data</main>;
  }

  return (
    <main>
      <h1 className="pt-4">Restaurants</h1>
      <RestaurantSearch restaurants={restaurants.data} />
    </main>
  );
}
