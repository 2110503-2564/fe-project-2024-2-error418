"use client";

import { useTransition } from "react";
import { useThemeContext } from "@/provider/theme";

export default function ThemeSwitcher() {
  const [isPending, startTransition] = useTransition();
  const { toggleTheme } = useThemeContext();

  function handleOnClick() {
    startTransition(async () => {
      await toggleTheme();
    });
  }

  return (
    <button className="disabled:opacity-10" onClick={handleOnClick} disabled={isPending}>
      Change
    </button>
  );
}
