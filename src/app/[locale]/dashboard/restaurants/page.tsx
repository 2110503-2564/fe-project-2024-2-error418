import { auth } from "@/auth";
import { getRestaurants } from "@/db/restaurants";
import { redirect } from "next/navigation";
import MyRestaurantSearch from "@/components/MyRestaurantSearch";
import { getTranslations } from "next-intl/server";
export default async function MyRestaurants() {
  const session = await auth();
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent("/dashboard/restaurants")}`);
  }
  const restaurants = await getRestaurants({}, { owner: session.user.id });
  if (!restaurants.success) {
    return <main>Cannot fetch data</main>;
  }

  const text = await getTranslations("TopNav");

  return (
    <main>
      <h1 className="pt-4">{text("my-restaurant")}</h1>
      <MyRestaurantSearch restaurants={restaurants.data} />
    </main>
  );
}
