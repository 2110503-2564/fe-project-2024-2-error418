import { auth } from "@/auth";
import { getUserData, logoutUser } from "@/db/auth";
import { Avatar } from "@mui/material";
import { getTranslations } from "next-intl/server";
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

  const text = await getTranslations("Profile");
  return (
    <main>
      <h1 className="pt-4">{text("profile")}</h1>
      {user.success ?
        <div className="ml-auto mr-auto mt-10 text-center h-[700px] w-[650px] rounded rounded-xl bg-[var(--cardbg)] border border-[var(--cardborder)] p-1 shadow-xl shadow-(color:--shadow)">
          <Avatar className="mt-4 ml-auto mr-auto" sx={{ width: 150, height: 150, bgcolor: stringToColor(user.data.name) }}>
            <div className="text-8xl">
              {user.data.name.charAt(0).toUpperCase()}
            </div>
          </Avatar>
          <div className="flex flex-col gap-4 py-4">
            <span className="text-5xl">{user.data.name}</span>
            <div className="flex flex-col py-4 mx-[100px] text-left">
              <span className="text-[var(--text-secondary)] text-sm">{text("phone")}:</span>
              <span className="bg-[var(--bg-secondary)] h-[50px] rounded rounded-2xl pt-[11px] pl-[15px] text-xl">{user.data.phone}</span>
              <span className="text-[var(--text-secondary)] text-sm mt-[40px]">{text("email")}:</span>
              <span className="bg-[var(--bg-secondary)] h-[50px] rounded rounded-2xl pt-[11px] pl-[15px] text-xl">{user.data.email}</span>
            </div>
          </div>

          <form action={logoutUser}>
                <button
                  className="w-fit cursor-pointer items-center mt-[150px] gap-2 text-[var(--text-secondary)]"
                  type="submit"
                  >
                  {text("logout")}
                </button>
              </form>
        </div>
      : <span>Cannot fetch User</span>}
    </main>
  );
}
