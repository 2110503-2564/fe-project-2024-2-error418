"use server";

import { cookies } from "next/headers";

const defaultValue = "theme-light";
const themeValue = ["theme-light", "theme-dark"] as const;
export type Theme = (typeof themeValue)[number];

export async function getTheme(): Promise<Theme> {
  const cookieTheme = (await cookies()).get("theme")?.value;
  const theme = themeValue.find((e) => e === cookieTheme);
  return theme ? theme : defaultValue;
}

export async function setThemeCookie(value: Theme) {
  const cookieStore = await cookies();
  cookieStore.set("theme", value, { maxAge: 3 * 24 * 60 * 60 });
}
