import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { getRestaurant } from "@/db/restaurants";
import { Button } from "@mui/material";

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
      <div className="flex flex-row gap-4 p-4">
        <Image
          className="w-[50%] rounded"
          src="/img/restaurant.jpg"
          alt={data.name}
          width={0}
          height={0}
          sizes="50vw"
          priority
        />
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <span>Address: {data.address}</span>
          <span>District: {data.district}</span>
          <span>Postal Code: {data.postalcode}</span>
          <span>Tel: {data.phone}</span>
          <div className="mt-4 flex gap-4">
            {user && (
              <Link href={`/restaurants/${data.id}/reserve`}>
                <Button variant="contained" type="button">
                  Reserve
                </Button>
              </Link>
            )}
            {user && user.id == data.owner && (
              <Link href={`/restaurants/${data.id}/edit`}>
                <Button variant="contained" type="button">
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
