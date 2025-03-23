"use client";

import { useActionState, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createReservation } from "@/db/reservations";
import dayjs from "dayjs";

export default function CreateReservation() {
  const params = useParams<{ id: string }>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(createReservation, undefined);
  useEffect(() => {
    console.log(state);
  }, [state]);
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  return (
    <main className="p-4">
      <h1 className="text-center text-2xl font-bold">Create Reservation</h1>
      <form className="flex flex-col items-center gap-4 py-4" action={action}>
        <input
          type="text"
          id="reservation-restaurant"
          name="restaurantID"
          value={params.id}
          readOnly
          hidden
        />
        <input
          type="text"
          id="reservation-reserveDate"
          name="reserveDate"
          value={date?.toISOString() || ""}
          readOnly
          hidden
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Reserve time"
            value={date}
            onChange={(val) => setDate(val)}
            sx={{
              "& .MuiInputBase-input": { color: "var(--text-primary)" },
              "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "var(--border-color)" },
                "&:hover fieldset": { borderColor: "var(--border-color)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-color)" },
              },
            }}
            className="bg-bg-secondary w-55 rounded"
          />
        </LocalizationProvider>

        <TextField
          id="reservation-personCount"
          name="personCount"
          label="Person Count"
          variant="outlined"
          type="number"
          InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
          InputProps={{ style: { color: "var(--text-primary)" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "var(--border-color)" },
              "&:hover fieldset": { borderColor: "var(--border-color)" },
              "&.Mui-focused fieldset": { borderColor: "var(--accent-color)" },
            },
          }}
          className="bg-bg-secondary w-55 rounded"
        />
        <Button variant="contained" disabled={pending} type="submit">
          Submit
        </Button>
      </form>
    </main>
  );
}
