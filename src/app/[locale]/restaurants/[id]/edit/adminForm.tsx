"use client";

import { addRestaurantAdmin } from "@/db/restaurants";
import { Button } from "@mui/material";
import { useActionState, useEffect } from "react";
import UserSearch from "./UserSearch";

export default function AdminForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(addRestaurantAdmin, undefined);
  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <form className="flex flex-col items-center gap-4 py-4" action={action}>
      <input type="text" name="restaurantID" value={id} readOnly hidden />
      <UserSearch name="email" />
      <Button variant="contained" type="submit" disabled={pending}>
        Add admin
      </Button>
    </form>
  );
}
