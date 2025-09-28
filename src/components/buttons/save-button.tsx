"use client";
import { Button } from "@/components/ui/button";

type SaveButtonProps = {
  onClick?: () => void;
};

export default function SaveButton({ onClick }: SaveButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="rounded-lg bg-lime-300 text-black font-semibold px-8 py-3 hover:bg-lime-400"
    >
      Save
    </Button>
  );
}
