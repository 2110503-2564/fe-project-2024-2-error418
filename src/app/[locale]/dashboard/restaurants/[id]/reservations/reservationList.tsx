import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { revalidatePath } from "next/cache";
import { ReservationJSON } from "@/db/models/Reservation";
import { editReservation } from "@/db/reservations";

export default function ReservationList({
  restaurantID,
  reservations,
}: {
  restaurantID: string;
  reservations: ReservationJSON[];
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Reserve Date</TableCell>
            <TableCell>Person Count</TableCell>
            <TableCell>Approval Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((row) => (
            <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>{row.reserveDate.toLocaleString()}</TableCell>
              <TableCell>{row.personCount}</TableCell>
              <TableCell>{row.approvalStatus}</TableCell>
              <TableCell>
                {row.approvalStatus == "pending" && (
                  <div className="flex w-fit items-center gap-4">
                    <EditButton
                      id={row.id}
                      restaurantID={restaurantID}
                      text="Reject"
                      approvalStatus="rejected"
                    />
                    <EditButton
                      id={row.id}
                      restaurantID={restaurantID}
                      text="Approve"
                      approvalStatus="approved"
                    />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function EditButton({
  id,
  restaurantID,
  approvalStatus,
  text,
}: {
  id: string;
  restaurantID: string;
  text: string;
  approvalStatus: "pending" | "canceled" | "approved" | "rejected";
}) {
  return (
    <form
      action={async () => {
        "use server";
        const result = await editReservation(id, approvalStatus);
        if (result.success) {
          revalidatePath(`/dashboard/restaurants/${restaurantID}/reservations`);
        }
      }}
    >
      <Button variant="contained" type="submit">
        {text}
      </Button>
    </form>
  );
}
