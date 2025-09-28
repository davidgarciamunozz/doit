"use client";

import Image from "next/image";

type WelcomeBannerProps = {
  name: string;
  avatarUrl?: string;
  className?: string;
};

export default function WelcomeBanner({
  name,
  avatarUrl,
  className,
}: WelcomeBannerProps) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "U";

  return (
    <div
      className={[
        "w-full flex items-center justify-between",
        "rounded-2xl border border-gray-200",
        "bg-[#F5F6F7] px-6 py-5",
        "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
        className || "",
      ].join(" ")}
    >
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
        Welcome, {name}!
      </h1>

      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
        />
      ) : (
        <div className="h-11 w-11 rounded-full bg-gray-300 flex items-center justify-center text-base font-semibold text-white ring-2 ring-white shadow-sm">
          {initials}
        </div>
      )}
    </div>
  );
}
