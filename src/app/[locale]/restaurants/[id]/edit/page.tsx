import Image from "next/image";
import { auth } from "@/auth";
import { getPopulatedRestaurant } from "@/db/restaurants";
// import { getTranslations } from "next-intl/server";
import EditRestaurantForm from "./form";
import { getTranslations } from "next-intl/server";

export default async function Restaurant({ params }: { params: Promise<{ id: string }> }) {
  const user = (await auth())?.user;
  const { id } = await params;
  const popRestaurant = await getPopulatedRestaurant(id);
  if (!popRestaurant.success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-gray-700">Cannot fetch data</div>
      </main>
    );
  }
  const { data } = popRestaurant;
  // const text = await getTranslations("RestaurantCard");

  const errText = await getTranslations("error")

  if (!user || user.id != data.owner) {
    return <h1>{errText("not-allowed-edit")}</h1>;
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-row gap-8">
          <div className="w-[50%]">
            <Image
              className="rounded shadow-md"
              src="/img/restaurant.jpg"
              alt={data.name}
              width={600}
              height={400}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>
          <EditRestaurantForm restaurant={popRestaurant.data} />
        </div>
      </div>
    </main>
  );
}
