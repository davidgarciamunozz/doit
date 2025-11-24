"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search ingredient",
}: SearchBarProps) {
  return (
    <div className="relative w-130">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="pr-10 rounded-lg border border-border bg-background"
      />
      <Search
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={18}
      />
    </div>
  );
}
