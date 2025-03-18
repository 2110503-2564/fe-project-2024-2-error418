"use client";

import { useTransition } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import styles from "./themeSwitcher.module.css";
import { useThemeContext } from "@/provider/theme";

export default function ThemeSwitcher() {
  const [isPending, startTransition] = useTransition();
  const { theme, toggleTheme } = useThemeContext();

  function handleOnChange() {
    if (!isPending) {
      startTransition(async () => {
        await toggleTheme();
      });
    }
  }

  return (
    <label className={styles.label} htmlFor="theme-selector">
      <input
        className="h-0 w-0 overflow-hidden opacity-0"
        role="button"
        type="checkbox"
        name="theme-selector"
        id="theme-selector"
        onChange={handleOnChange}
        checked={theme == "theme-dark"}
      />
      <SunIcon className={styles.sun} />
      <MoonIcon className={styles.moon} />
      <span className={styles.ball}></span>
    </label>
  );
}
