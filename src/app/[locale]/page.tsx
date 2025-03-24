import { use } from "react";
import { Locale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { VlogPlayer } from "@/components/VlogPlayer";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import ServicesLayout from "@/components/ServicesLayout";

export default function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  const text = useTranslations("HomePage");
  return (
    <main>
      <VlogPlayer vdoSrc="/video/restaurant.mp4"></VlogPlayer>
      <div className="w-full h-full mt-10 absolute text-center text-5xl font-bold text-white">{text("title")}</div>
      <div className="overlay mt-200 bg-[var(--background)]">
        <ServicesLayout></ServicesLayout>
      </div>
    </main>
  );
}