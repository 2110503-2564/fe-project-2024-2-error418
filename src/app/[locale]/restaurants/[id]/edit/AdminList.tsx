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

export default function AdminList({
  restaurantID,
  data,
}: {
  restaurantID: string;
  data: { id: string; name: string; email: string }[];
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AvatarIcon width={32} height={32} name={row.name} />
                  {row.name}
                </div>
              </TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>admin</TableCell>
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
                  <Button variant="contained" type="submit">
                    Delete
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
