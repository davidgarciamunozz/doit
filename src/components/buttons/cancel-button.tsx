"use client";
import { Button } from "@/components/ui/button";

type CancelButtonProps = {
  onClick?: () => void;
};

export default function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="rounded-lg bg-gray-800 w-50 text-white font-semibold px-8 py-3 hover:bg-gray-700"
    >
      Cancel
    </Button>
  );
}
