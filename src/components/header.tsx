import Image from "next/image";
import { AuthButton } from "./auth-button";
import Link from "next/link";

export function Header() {
  return (
    <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm bg-background">
      <div className="flex gap-5 items-center font-semibold">
        <Link
          href={"/"}
          className="hover:text-orange-300 dark:hover:text-orange-400"
        >
          <Image
            src="/brand/hero-logo.png"
            alt="Doit"
            width={130}
            height={50}
          />
        </Link>
      </div>
      <AuthButton />
    </div>
  );
}
