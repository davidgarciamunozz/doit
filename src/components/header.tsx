import { AuthButton } from "./auth-button";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm bg-background">
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <Image
          src="/brand/hero-logo.png"
          alt="Doit"
          width={100}
          height={38}
          className="h-auto w-auto"
        />
      </Link>
      <AuthButton />
    </div>
  );
}
