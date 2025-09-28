"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StatusFilter() {
  return (
    <Select>
      <SelectTrigger className="w-[180px] rounded-full border border-gray-200 bg-white">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="shortage">Order Placed</SelectItem>
        <SelectItem value="out-of-stock">In Progress</SelectItem>
        <SelectItem value="low-stock">Ready for Delivery</SelectItem>
        <SelectItem value="in-stock">Delivered</SelectItem>
      </SelectContent>
    </Select>
  );
}
