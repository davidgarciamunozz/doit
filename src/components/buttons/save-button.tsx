"use client";
import { Button } from "@/components/ui/button";

type SaveButtonProps = {
  onClick?: () => void;
};

export default function SaveButton({ onClick }: SaveButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="rounded-lg bg-[#D3F36B] w-50 text-black font-semibold px-8 py-3 hover:bg-[#C7ED4F]"
    >
      Save
    </Button>
  );
}
