import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AvatarIcon from "@/components/AvatarIcon";
import { Button } from "@mui/material";
import { removeRestaurantAdmin } from "@/db/restaurants";
import { revalidatePath } from "next/cache";
import { useTranslations } from "next-intl";

export default function AdminList({
  restaurantID,
  data,
}: {
  restaurantID: string;
  data: { id: string; name: string; email: string }[];
}) {

  const text = useTranslations("AddAdmin");
  const btnText = useTranslations("Button");
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow className="border border-[var(--cardborder)] bg-[var(--cardbg)]">
            <TableCell><div className="text-[var(--text-primary)]">{text("name")}</div></TableCell>
            <TableCell><div className="text-[var(--text-primary)]">{text("email")}</div></TableCell>
            <TableCell><div className="text-[var(--text-primary)]">{text("role")}</div></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.name} className="border border-[var(--cardborder)] bg-[var(--cardbg)]" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>
                <div className="flex items-center gap-2 text-[var(--text-primary)]">
                  <AvatarIcon width={32} height={32} name={row.name} />
                  {row.name}
                </div>
              </TableCell>
              <TableCell><div className="text-[var(--text-primary)]">{row.email}</div></TableCell>
              <TableCell><div className="text-[var(--text-primary)]">{text("admin")}</div></TableCell>
              <TableCell>
                <form
                  action={async () => {
                    "use server";
                    const result = await removeRestaurantAdmin(restaurantID, row.id);
                    if (result.success) {
                      revalidatePath(`/restaurants/${restaurantID}/edit`);
                    }
                  }}
                >
                  <Button variant="contained" type="submit" color="error">
                    {btnText("delete")}
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
