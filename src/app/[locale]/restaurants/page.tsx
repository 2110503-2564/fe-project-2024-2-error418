import { getRestaurants } from "@/db/restaurants";
import RestaurantSearch from "@/components/RestaurantSearch";
import { getTranslations } from "next-intl/server";

export default async function Restaurants() {
  const restaurants = await getRestaurants();
  
  if (!restaurants.success) {
    return <main>Cannot fetch data</main>;
  }
  
  const text = await getTranslations("Restaurants");
  
  return (
    <main>
      <h1 className="pt-4">{text("title")}</h1>
      <RestaurantSearch restaurants={restaurants.data} />
    </main>
  );
}
