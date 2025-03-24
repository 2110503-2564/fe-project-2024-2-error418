import { getPopulatedRestaurant } from "@/db/restaurants";
import EditRestaurantForm from "./form";
import { Avatar, List, ListItem } from "@mui/material";
import AdminForm from "./adminForm";

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
          <AdminForm id={id} />
          {restaurant.data.admin.length != 0 && (
            <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
              {restaurant.data.admin.map((e) => (
                <ListItem className="flex items-center gap-2" key={e.email}>
                  <Avatar alt="Remy Sharp">RS</Avatar>
                  {e.name}
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </section>
      <section>
        <EditRestaurantForm restaurant={restaurant.data} />
      </section>
    </main>
  );
}
