import { Context, use } from "react";
import { Locale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function Home({ params }: { params: Context<{ locale: Locale }> }) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  const text = useTranslations("HomePage");
  return (
    <main>
      <h1>{text("title")}</h1>
      <p>{text("greeting", { username: "Dave" })}</p>
    </main>
  );
}
