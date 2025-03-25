import { getPopulatedRestaurant } from "@/db/restaurants";
import AdminForm from "./adminForm";
import AdminList from "./adminList";
import { getTranslations } from "next-intl/server";

export default async function EditRestaurant({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await getPopulatedRestaurant(id);
  if (!restaurant.success) {
    return <main>Cannot fetch data</main>;
  }

  const text = await getTranslations("AddAdmin");

  return (
    <main>
      <h1 className="pt-4">{text("titel")}</h1>
      <div className="ml-auto mr-auto my-10 text-center h-fit w-fit rounded rounded-xl bg-[var(--cardbg)] border border-[var(--cardborder)] p-5 shadow-xl shadow-(color:--shadow)">
        <section>
          <div className="mx-auto w-fit">
            {restaurant.data.admin.length != 0 && (
              <AdminList restaurantID={id} data={restaurant.data.admin} />
            )}
            <AdminForm id={id} data={restaurant.data.admin} />
          </div>
        </section>
      </div>
    </main>
  );
}
