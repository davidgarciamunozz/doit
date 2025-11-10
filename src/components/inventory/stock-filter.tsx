"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StockFilter() {
  return (
    <Select>
      <SelectTrigger className="w-[180px] rounded-full border border-border bg-background">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="shortage">Shortage</SelectItem>
        <SelectItem value="unavailable">Unavailable</SelectItem>
        <SelectItem value="low">Low stock</SelectItem>
        <SelectItem value="unavailable">Available</SelectItem>
      </SelectContent>
    </Select>
  );
}
