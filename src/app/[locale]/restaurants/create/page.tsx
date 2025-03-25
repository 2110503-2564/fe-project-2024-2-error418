"use client";

import { useActionState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { createRestaurant } from "@/db/restaurants";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function CreateRestaurant() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(createRestaurant, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard/restaurants");
    }
  }, [state, router]);

  const text = useTranslations("RestaurantCard");
  const btnText = useTranslations("Button");

  const arr = ["name", "address", "district", "province", "postalcode", "region", "phone"] as const;
  return (
    <main className="p-4">
      <h1 className="text-center text-2xl font-bold">{text("create")}</h1>
      <form
        className="my-10 mr-auto ml-auto flex h-fit w-fit flex-col items-center gap-4 rounded rounded-xl border border-[var(--cardborder)] bg-[var(--cardbg)] p-5 py-4"
        action={action}
      >
        {arr.map((e) => (
          <TextField
            key={e}
            id={e}
            name={e}
            label={text(e)}
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
          {btnText("submit")}
        </Button>
      </form>
    </main>
  );
}
