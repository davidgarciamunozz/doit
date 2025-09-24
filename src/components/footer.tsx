import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs py-4">
      <p>© Doit 2025</p>
      <ThemeSwitcher />
      <Link href="/legal" className="hover:underline">
        Legal
      </Link>
    </footer>
  );
}
