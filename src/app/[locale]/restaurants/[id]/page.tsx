import { getRestaurant } from "@/db/restaurants";

export default async function Restaurant({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  if (!restaurant.success) {
    return <main>Cannot fetch data</main>;
  }
  return <main>{JSON.stringify(restaurant)}</main>;
}
