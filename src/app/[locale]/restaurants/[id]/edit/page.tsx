import { getRestaurant } from "@/db/restaurants";
import EditRestaurantForm from "./form";

export default async function EditRestaurant({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await getRestaurant(id);

  if (!restaurant.success) {
    return <main>Cannot fetch data</main>;
  }
  return (
    <main>
      <EditRestaurantForm restaurant={restaurant.data} />
    </main>
  );
}
