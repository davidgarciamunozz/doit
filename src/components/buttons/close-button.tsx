"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type CloseButtonProps = {
  onClick?: () => void;
};

export default function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="w-8 h-8 p-0 aspect-square rounded-lg bg-gray-800 hover:bg-gray-600 flex items-center justify-center"
      variant="ghost"
    >
      <X size={32} className="text-white" />
    </Button>
  );
}
