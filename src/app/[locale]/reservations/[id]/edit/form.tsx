"use client";

import { useActionState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ReservationJSON } from "@/db/models/Reservation";
import { editReservation } from "@/db/reservations";

export default function EditReservationForm({ reservation }: { reservation: ReservationJSON }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(editReservation, undefined);

  return (
    <form className="flex flex-col items-center gap-4 py-4" action={action}>
      <input type="text" name="reservationID" value={reservation.id} readOnly hidden />
      <FormControl className="w-32">
        <InputLabel id="approval-label">Approval Status</InputLabel>
        <Select
          labelId="approval-label"
          id="approvalStatus"
          name="approvalStatus"
          label="Approval Status"
          defaultValue={reservation.approvalStatus}
        >
          <MenuItem value="pending" disabled>
            Pending
          </MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" disabled={pending} type="submit">
        Submit
      </Button>
    </form>
  );
}
