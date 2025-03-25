"use client";

import { useActionState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { createRestaurant } from "@/db/restaurants";
import { useRouter } from "next/navigation";

export default function CreateRestaurant() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(createRestaurant, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard/restaurants");
    }
  }, [state, router]);

  return (
    <main className="p-4">
      <h1 className="text-center text-2xl font-bold">Create Restaurant</h1>
      <form className="flex flex-col items-center gap-4 py-4" action={action}>
        {["name", "address", "district", "province", "postalcode", "region", "phone"].map((e) => (
          <TextField
            key={e}
            id={e}
            name={e}
            label={e.charAt(0).toUpperCase() + e.slice(1)}
            variant="outlined"
            InputLabelProps={{ style: { color: "var(--text-primary)" } }}
            InputProps={{ style: { color: "var(--text-primary)" } }}
            required
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
    </main>
  );
}
