"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({
  children,
  session,
}: {
  children: Readonly<React.ReactNode>;
  session: Session | null;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
