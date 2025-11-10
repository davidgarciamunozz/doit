import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t border-border bg-background mx-auto text-center text-xs py-4 gap-4">
      <p className="text-foreground">© Doit 2025</p>
      <ThemeSwitcher />
      <Link href="/legal" className="hover:underline text-foreground">
        Legal
      </Link>
    </footer>
  );
}
