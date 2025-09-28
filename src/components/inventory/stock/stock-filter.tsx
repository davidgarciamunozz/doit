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
      <SelectTrigger className="w-[180px] rounded-full border border-gray-200 bg-white">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="shortage">Shortage</SelectItem>
        <SelectItem value="out-of-stock">Out of stock</SelectItem>
        <SelectItem value="low-stock">Low stock</SelectItem>
        <SelectItem value="in-stock">In Stock</SelectItem>
      </SelectContent>
    </Select>
  );
}
