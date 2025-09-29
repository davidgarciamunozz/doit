"use client";
import { Button } from "@/components/ui/button";

type SaveButtonProps = {
  onClick?: () => void;
  label?: string;
};

export default function SaveButton({
  onClick,
  label = "Save",
}: SaveButtonProps) {
  return (
    <Button
      type="submit" // importante para que dispare el submit del form
      onClick={onClick}
      className="rounded-lg bg-lime-300 text-black font-semibold px-8 py-3 hover:bg-lime-400 w-full"
    >
      {label}
    </Button>
  );
}
