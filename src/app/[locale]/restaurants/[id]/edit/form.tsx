"use client";

import { editRestaurant, PopulatedRestaurantJSON } from "@/db/restaurants";
import { Button, TextField } from "@mui/material";
import { useActionState } from "react";

export default function EditRestaurantForm({
  restaurant,
}: {
  restaurant: PopulatedRestaurantJSON;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(editRestaurant, undefined);

  return (
    <form className="flex flex-col items-center gap-4 py-4" action={action}>
      <input type="text" name="restaurantID" value={restaurant.id} readOnly hidden />
      {["name", "address", "district", "province", "postalcode", "region", "phone"].map((e) => (
        <TextField
          key={e}
          id={e}
          name={e}
          label={e.charAt(0).toUpperCase() + e.slice(1)}
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
        Submit
      </Button>
    </form>
  );
}
