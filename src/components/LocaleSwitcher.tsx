import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

export default function LocaleSwitcher() {
  const text = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={text("label")}>
      {routing.locales.map((cur) => (
        <option key={cur} value={cur} className="text-black">
          {text("locale", { locale: cur })}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
