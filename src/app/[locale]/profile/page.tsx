import { auth } from "@/auth";
import { getUserData } from "@/db/auth";
import { Avatar } from "@mui/material";
import { redirect } from "next/navigation";

export default async function Profile() {
  function stringToColor(string: string) {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  const session = await auth();
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent("/profile")}`);
  }
  const user = await getUserData(session.user.id);

  return (
    <main>
      <h1>Profile</h1>
      {user.success ?
        <div>
          <Avatar sx={{ width: 32, height: 32, bgcolor: stringToColor(user.data.name) }}>
            {user.data.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex flex-col gap-4 py-4">
            <span>Name: {user.data.name}</span>
            <span>phone: {user.data.phone}</span>
            <span>email: {user.data.email}</span>
          </div>
        </div>
      : <span>Cannot fetch User</span>}
    </main>
  );
}
