"use client";

import { setThemeCookie, Theme } from "@/libs/theme";
import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

export const ThemeContext = createContext<
  | { theme: Theme; setTheme: Dispatch<SetStateAction<Theme>>; toggleTheme: () => Promise<void> }
  | undefined
>(undefined);

export function ThemeProvider({
  children,
  cookieTheme,
}: {
  children: Readonly<React.ReactNode>;
  cookieTheme: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(cookieTheme);

  async function toggleTheme() {
    const newValue = theme == "theme-light" ? "theme-dark" : "theme-light";
    setTheme(newValue);
    await setThemeCookie(newValue);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <body className={theme}>{children}</body>
    </ThemeContext.Provider>
  );
}

// Custom hooks
export function useThemeContext() {
  const themeContext = useContext(ThemeContext);
  if (themeContext == undefined) {
    throw new Error("useThemeContext must be inside a ThemeProvider");
  }
  return themeContext;
}
