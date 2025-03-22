"use client";

import { useActionState } from "react";
import { Button, TextField } from "@mui/material";
import { ReservationJSON } from "@/db/models/Reservation";
import { editReservation } from "@/db/reservations";

export default function EditReservationForm({ reservation }: { reservation: ReservationJSON }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(editReservation, undefined);

  return (
    <form className="flex flex-col items-center gap-4 py-4" action={action}>
      <input type="text" name="restaurantID" value={reservation.id} readOnly hidden />
      <TextField
        id="approvalStatus"
        name="approvalStatus"
        label="Approval Status"
        variant="outlined"
        defaultValue={reservation.approvalStatus}
      />
      <Button variant="contained" disabled={pending} type="submit">
        Submit
      </Button>
    </form>
  );
}
