import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { deleteRestaurant, getRestaurant } from "@/db/restaurants";
import { Button } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import DeleteButton from "./DeleteButton";

export default async function Restaurant({ params }: { params: Promise<{ id: string }> }) {
  const user = (await auth())?.user;
  const { id } = await params;
  const restaurant = await getRestaurant(id);

  if (!restaurant.success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-gray-700">Cannot fetch data</div>
      </main>
    );
  }
  const { data } = restaurant;

  const text = await getTranslations("RestaurantCard");
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
          <div className="flex flex-col items-start gap-4">
            <div className="flex gap-4 text-3xl font-bold text-yellow-600">
              {data.name}
              {user && user.id == data.owner && (
                <>
                  <Button size="small" href={`/restaurants/${data.id}/edit`}>
                    {text("edit")}
                  </Button>
                  <DeleteButton
                    confirmText={data.name}
                    deleteAction={async () => {
                      "use server";
                      const result = await deleteRestaurant(id);
                      if (result.success) {
                        redirect("/restaurants");
                      }
                    }}
                  />
                </>
              )}
            </div>

            <div className="text-xl">
              <div>
                {text("address")}: {data.address}
              </div>
              <div className="mt-1">
                {text("district")}: {data.district}
              </div>
              <div className="mt-1">
                {text("province")}: {data.province}
              </div>
              <div className="mt-1">
                {text("postalcode")}: {data.postalcode}
              </div>
              <div className="mt-1">
                {text("region")}: {data.region}
              </div>
              <div className="mt-1">
                {text("phone")}: {data.phone}
              </div>
            </div>
            <div className="flex gap-4">
              {user && user.id == data.owner && (
                <Button variant="outlined" href={`/dashboard/restaurants/${data.id}`}>
                  {text("dashboard")}
                </Button>
              )}
              {user && user.id == data.owner && (
                <Button variant="outlined" href={`/restaurants/${data.id}/edit`}>
                  {text("add-admin")}
                </Button>
              )}
            </div>
            <div className="mt-6">
              {user && (
                <Link href={`/restaurants/${data.id}/reserve`}>
                  <Button variant="contained">{text("reserve")}</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
