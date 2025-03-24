import { use } from "react";
import { Locale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { VlogPlayer } from "@/components/VlogPlayer";
import ServicesLayout from "@/components/ServicesLayout";

export default function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  const text = useTranslations("HomePage");
  return (
    <main>
      <VlogPlayer vdoSrc="/video/restaurant.mp4"></VlogPlayer>
      <div className="absolute mt-10 h-full w-full text-center text-5xl font-bold text-white">
        {text("title")}
      </div>
      <div className="overlay mt-200 bg-[var(--background)]">
        <ServicesLayout></ServicesLayout>
      </div>
    </main>
  );
}
