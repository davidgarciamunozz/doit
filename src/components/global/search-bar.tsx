"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-130">
      <Input
        type="text"
        placeholder="Search ingredient"
        className="pr-10 rounded-lg border border-gray-200 bg-white"
      />
      <Search
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
    </div>
  );
}
