import { useTranslations } from "next-intl";

export default function Home() {
  const text = useTranslations("HomePage");
  return (
    <main>
      <h1>{text("title")}</h1>
      <p>{text("greeting", { username: "Dave" })}</p>
    </main>
  );
}
