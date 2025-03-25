"use client";

import { useActionState } from "react";
import { Button, TextField } from "@mui/material";
import { createRestaurant } from "@/db/restaurants";
import { useTranslations } from "next-intl";

export default function CreateRestaurant() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(createRestaurant, undefined);

  const text = useTranslations("RestaurantCard")
  const btnText = useTranslations("Button");

  const arr = ["name", "address", "district", "province", "postalcode", "region", "phone"] as const;
  return (
    <main className="p-4">
      <h1 className="text-center text-2xl font-bold">{text("create")}</h1>
      <form className="flex flex-col items-center gap-4 py-4 ml-auto mr-auto my-10 h-fit w-fit rounded rounded-xl bg-[var(--cardbg)] border border-[var(--cardborder)] p-5" action={action}>
        {arr.map((e) => (
          <TextField
            key={e}
            id={e}
            name={e}
            label={text(e)}
            variant="outlined"
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
    </main>
  );
}
