import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="p-4">
      <h1>Profile</h1>
      <div className="flex flex-col gap-4 py-4">
        <span>Name: {session.user.name}</span>
      </div>
    </main>
  );
}
