import { auth } from "@/auth";
import { RestaurantJSON } from "@/db/models/Restaurant";
import { getRestaurants } from "@/db/restaurants";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyRestaurants() {
  const session = await auth();
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent("/restaurants")}`);
  }
  const restaurants = await getRestaurants({}, { owner: session.user.id });
  if (!restaurants.success) {
    return <main>Cannot fetch data</main>;
  }

  return (
    <main>
      <h1>My Restaurants</h1>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(16.5rem,1fr))] justify-items-center gap-8 py-4">
        {restaurants.data.map((e) => (
          <li key={e.id}>
            {/* GO TO DASHBOARD */}
            <Link href={`/restaurants/${e.id}`}>
              <Card {...e}></Card>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Card({ name, address, region }: RestaurantJSON) {
  return (
    <div className="h-[22rem] w-[16.5rem] rounded-lg bg-white p-1 shadow-lg hover:bg-neutral-200 hover:shadow-2xl">
      <div className="h-[67%]">
        <Image
          className="pointer-events-none h-full w-auto rounded-sm object-cover object-center select-none"
          src="/img/restaurant.jpg"
          alt={name}
          width={0}
          height={0}
          sizes="100vw"
          priority
        />
      </div>
      <div className="flex h-[33%] flex-col overflow-auto">
        <h2 className="pt-4 pb-2 text-[1rem] font-bold">{name}</h2>
        <span>{address}</span>
        <span>{region}</span>
      </div>
    </div>
  );
}
