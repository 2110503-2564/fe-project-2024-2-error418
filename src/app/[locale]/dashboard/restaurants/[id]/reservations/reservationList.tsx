import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { revalidatePath } from "next/cache";
import { editReservation, UserPopulatedReservationJSON } from "@/db/reservations";
import AvatarIcon from "@/components/AvatarIcon";
import { useTranslations } from "next-intl";

export default function ReservationList({
  restaurantID,
  reservations,
}: {
  restaurantID: string;
  reservations: UserPopulatedReservationJSON[];
}) {

  const text = useTranslations("ManageReservations");
  const statusText = useTranslations("Status")
  const btnText = useTranslations("Button")
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow className="border border-[var(--cardborder)] bg-[var(--cardbg)]">
            <TableCell><div className="text-[var(--text-primary)]">{text("name")}</div></TableCell>
            <TableCell><div className="text-[var(--text-primary)]">{text("date")}</div></TableCell>
            <TableCell><div className="text-[var(--text-primary)]">{text("personcount")}</div></TableCell>
            <TableCell><div className="text-[var(--text-primary)]">{text("status")}</div></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((row) => (
            <TableRow className="border border-[var(--cardborder)] bg-[var(--cardbg)]" key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>
                <div className="flex items-center gap-2 text-[var(--text-primary)]">
                  <AvatarIcon width={32} height={32} name={row.user.name} />
                  {row.user.name}
                </div>
              </TableCell>
              <TableCell><div className="text-[var(--text-primary)]">{row.reserveDate.toLocaleString()}</div></TableCell>
              <TableCell><div className="text-[var(--text-primary)]">{row.personCount}</div></TableCell>
              <TableCell>
                <div className="text-[var(--foreground)]">
                  {
                    row.approvalStatus == "approved" ?
                    <div className="mt-2 h-[30px] w-[100px] rounded-full bg-green-600 pt-[3px] text-center font-bold">
                      {statusText("approved")}
                    </div>
                  : row.approvalStatus == "pending" ?
                    <div className="mt-2 h-[30px] w-[100px] rounded-full bg-yellow-600 pt-[3px] text-center font-bold">
                      {statusText("pending")}
                    </div>
                  : <div className="mt-2 h-[30px] w-[100px] rounded-full bg-red-600 pt-[3px] text-center font-bold">
                      {row.approvalStatus == "canceled" ? statusText("canceled") : statusText("rejected")}
                    </div>
                  }
                </div>
              </TableCell>
              <TableCell>
                {row.approvalStatus == "pending" && (
                  <div className="flex w-fit items-center gap-4">
                    <EditButton
                      id={row.id}
                      restaurantID={restaurantID}
                      text={btnText("reject")}
                      approvalStatus="rejected"
                    />
                    <EditButton
                      id={row.id}
                      restaurantID={restaurantID}
                      text={btnText("approve")}
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
