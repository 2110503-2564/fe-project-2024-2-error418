"use client";

import { addRestaurantAdmin } from "@/db/restaurants";
import { Button, TextField } from "@mui/material";
import { useActionState, useEffect, useState } from "react";

export default function AdminForm({ id }: { id: string }) {
  const [email, setEmail] = useState("");
  const [state, action, pending] = useActionState(addRestaurantAdmin, undefined);
  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <form className="flex flex-col items-center gap-4 py-4" action={action}>
      <input type="text" name="restaurantID" value={id} readOnly hidden />
      <TextField
        name="email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <Button variant="contained" type="submit" disabled={pending}>
        Add admin
      </Button>
    </form>
  );
}
