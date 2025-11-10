"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-130">
      <Input
        type="text"
        placeholder="Search ingredient"
        className="pr-10 rounded-lg border border-border bg-background"
      />
      <Search
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={18}
      />
    </div>
  );
}
