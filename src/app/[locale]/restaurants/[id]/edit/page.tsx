import { getPopulatedRestaurant } from "@/db/restaurants";
import EditRestaurantForm from "./form";
import AdminForm from "./AdminForm";
import AdminList from "./AdminList";

export default async function EditRestaurant({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await getPopulatedRestaurant(id);
  if (!restaurant.success) {
    return <main>Cannot fetch data</main>;
  }
  return (
    <main>
      <h1>Edit Restaurant</h1>
      <section>
        <div className="mx-auto w-fit">
          <AdminForm id={id} data={restaurant.data.admin} />
          {restaurant.data.admin.length != 0 && (
            <AdminList restaurantID={id} data={restaurant.data.admin} />
          )}
        </div>
      </section>
      <section>
        <EditRestaurantForm restaurant={restaurant.data} />
      </section>
    </main>
  );
}
