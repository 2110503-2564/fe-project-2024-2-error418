import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import AccountMenu from "./AccountMenu";

export default function TopNav({ session }: { session: Session | null }) {
  const text = useTranslations("TopNav");
  const links: { href: string; name: string }[] = [
    { href: "/", name: text("home") },
    { href: "/restaurants", name: text("restaurants") },
    { href: "/reservations", name: text("reservations") },
  ];

  return (
    <nav className="fixed top-0 left-0 z-10 flex h-16 w-full items-center justify-between bg-[var(--primary)] p-4">
      {/* Links */}
      <ul className="flex items-center gap-4">
        {links.map(({ href, name }) => (
          <li key={name}>
            <Link href={href} className="text-[var(--foreground)] hover:text-gray-400">
              {name}
            </Link>
          </li>
        ))}
      </ul>
      {/* User Actions */}
      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        <ThemeSwitcher />
        <AccountMenu session={session} />
      </div>
    </nav>
  );
}
