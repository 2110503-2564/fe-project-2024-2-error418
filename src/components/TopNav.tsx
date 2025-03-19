import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

export default function TopNav() {
  const text = useTranslations("TopNav");
  const links: { href: string; name: string }[] = [
    { href: "/", name: text("home") },
    { href: "/restaurants", name: text("restaurants") },
    { href: "/reservations", name: text("reservations") },
  ];

  return (
    <nav className="fixed top-0 left-0 flex h-16 w-full items-center justify-between bg-[var(--primary)] p-4">
      {/* Links */}
      <ul className="flex items-center gap-4">
        {links.map(({ href, name }) => (
          <li key={name}>
            <Link href={href}>{name}</Link>
          </li>
        ))}
      </ul>
      {/* User Actions */}
      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        <ThemeSwitcher />
        <span>Profile</span>
      </div>
    </nav>
  );
}
