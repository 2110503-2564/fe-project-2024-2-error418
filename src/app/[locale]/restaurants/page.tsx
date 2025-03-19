import { getRestaurants } from "@/db/restaurants";

export default async function Restaurants() {
  const restaurants = await getRestaurants();
  if (!restaurants.success) {
    return <main>Cannot fetch data</main>;
  }
  return <main>{JSON.stringify(restaurants)}</main>;
}
