import { auth } from "@/auth";
import { getRestaurant } from "@/db/restaurants";
import { Link } from "@/i18n/navigation";

export default async function Restaurant({ params }: { params: Promise<{ id: string }> }) {
  const user = (await auth())?.user;
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  if (!restaurant.success) {
    return <main>Cannot fetch data</main>;
  }
  const { data } = restaurant;
  return (
    <main>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <span>Address: {data.address}</span>
        <span>District: {data.district}</span>
        <span>Postal Code: {data.postalcode}</span>
        <span>Tel: {data.phone}</span>
        {user && <Link href={`/restaurants/${data.id}/reserve`}>Reserve</Link>}
        {user && user.id == data.owner && <Link href={`/restaurants/${data.id}/edit`}>Edit</Link>}
      </div>
    </main>
  );
}
