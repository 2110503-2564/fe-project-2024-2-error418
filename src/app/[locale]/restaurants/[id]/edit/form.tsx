"use client";

import { editRestaurant, PopulatedRestaurantJSON } from "@/db/restaurants";
import { Button, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

export default function EditRestaurantForm({
  restaurant,
}: {
  restaurant: PopulatedRestaurantJSON;
}) {
  const btnText = useTranslations("Button");
  const text = useTranslations("RestaurantCard");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(editRestaurant, undefined);

  const arr = ["name", "address", "district", "province", "postalcode", "region", "phone"] as const;

  return (
    <form className="flex flex-col items-center gap-4 py-4" action={action}>
      <input type="text" name="restaurantID" value={restaurant.id} readOnly hidden />
      {arr.map((e) => (
        <TextField
          key={e}
          id={e}
          name={e}
          label={text(e)}
          variant="outlined"
          defaultValue={Object(restaurant)[e]}
          InputLabelProps={{ style: { color: "var(--text-primary)" } }}
          InputProps={{ style: { color: "var(--text-primary)" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "var(--border-color)" },
              "&:hover fieldset": { borderColor: "var(--border-color)" },
              "&.Mui-focused fieldset": { borderColor: "var(--accent-color)" },
            },
          }}
          className="bg-bg-secondary w-100 rounded"
        />
      ))}
      <Button variant="contained" disabled={pending} type="submit">
        {btnText("submit")}
      </Button>
    </form>
  );
}
