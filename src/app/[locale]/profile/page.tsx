import { auth } from "@/auth";
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
    redirect("/login");
  }

  return (
    <main>
      <h1>Profile</h1>
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: session ? stringToColor(session.user.name) : undefined,
        }}
      >
        {session ? session.user.name.charAt(0).toUpperCase() : null}
      </Avatar>
      <div className="flex flex-col gap-4 py-4">
        <span>Name: {session.user.name}</span>
        <span>phone: {session.user.phone}</span>
        <span>email: {session.user.email}</span>
      </div>
    </main>
  );
}
