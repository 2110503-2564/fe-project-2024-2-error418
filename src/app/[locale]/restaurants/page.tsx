import { RestaurantJSON } from "@/db/models/Restaurant";
import { getRestaurants } from "@/db/restaurants";
import { Link } from "@/i18n/navigation";

export default async function Restaurants() {
  const restaurants = await getRestaurants();
  if (!restaurants.success) {
    return <main>Cannot fetch data</main>;
  }
  return (
    <main>
      <h1>Restaurants</h1>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(16.5rem,1fr))] justify-items-center gap-8 py-4">
        {restaurants.data.map((e) => (
          <li key={e.id}>
            <Link href={`/restaurants/${e.id}`}>
              <Card {...e}></Card>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Card({ name, address }: RestaurantJSON) {
  return (
    <div className="h-[22rem] w-[16.5rem] rounded-lg bg-white p-1 shadow-lg hover:bg-neutral-200 hover:shadow-2xl">
      <h2 className="pt-4 pb-2 text-[1rem] font-bold">{name}</h2>
      <span>{address}</span>
    </div>
  );
}
