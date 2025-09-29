"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import clsx from "clsx";

type AddButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "green" | "yellow" | "light-green";
};

export default function AddButton({
  label,
  onClick,
  variant = "primary",
}: AddButtonProps) {
  const baseStyles =
    "w-50 rounded-lg font-semibold px-6 py-3 flex items-center gap-2";

  const variants = {
    "primary": "bg-[#D3F36B] text-black hover:bg-[#C7ED4F]",
    "green": "bg-lime-200 text-green-800 hover:bg-lime-300",
    "yellow": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    "light-green": "bg-lime-100 text-lime-700 hover:bg-lime-200",
  };

  return (
    <Button onClick={onClick} className={clsx(baseStyles, variants[variant])}>
      <Plus size={18} />
      {label}
    </Button>
  );
}
