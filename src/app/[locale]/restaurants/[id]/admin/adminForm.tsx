import { addRestaurantAdmin } from "@/db/restaurants";
import { Button } from "@mui/material";
import UserSearch from "./UserSearch";
import { revalidatePath } from "next/cache";
import { useTranslations } from "next-intl";

export default function AdminForm({
  id,
  data,
}: {
  id: string;
  data: { id: string; name: string; email: string }[];
}) {

  const btnText = useTranslations("Button");
  return (
    <form
      className="flex flex-col items-center gap-4 py-4"
      action={async (formData) => {
        "use server";
        const email = formData.get("email") as string | null;
        if (email) {
          const result = await addRestaurantAdmin(id, email);
          if (result.success) {
            revalidatePath(`/restaurants/${id}/edit`);
          }
        }
      }}
    >
      <input type="text" name="restaurantID" value={id} readOnly hidden />
      <UserSearch name="email" data={data} />
      <Button variant="contained" type="submit">
        {btnText("add-admin")}
      </Button>
    </form>
  );
}
