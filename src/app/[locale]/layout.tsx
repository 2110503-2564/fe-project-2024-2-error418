import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { getTheme } from "@/libs/theme";
import ThemeProvider from "@/provider/ThemeProvider";
import NextAuthProvider from "@/provider/NextAuthProvider";
import TopNav from "@/components/TopNav";

export async function generateMetadata(): Promise<Metadata> {
  const text = await getTranslations("Metadata");
  return { title: text("title"), description: text("description") };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: Readonly<React.ReactNode>;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Enable static rendering
  setRequestLocale(locale);

  const theme = await getTheme();
  const session = await getServerSession();

  return (
    <html lang={`${locale}-th`}>
      {/* body tag is in provider */}
      <ThemeProvider cookieTheme={theme}>
        <NextAuthProvider session={session}>
          <NextIntlClientProvider>
            <TopNav />
            <div className="mt-16">{children}</div>
          </NextIntlClientProvider>
        </NextAuthProvider>
      </ThemeProvider>
    </html>
  );
}
