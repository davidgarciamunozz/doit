"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StockStatus } from "@/lib/types/inventory/types";

type StockFilterValue = "all" | StockStatus;

interface StockFilterProps {
  value?: StockFilterValue;
  onChange?: (value: StockFilterValue) => void;
}

export default function StockFilter({ value, onChange }: StockFilterProps) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(val) => onChange?.(val as StockFilterValue)}
    >
      <SelectTrigger className="w-[180px] rounded-full border border-border bg-background">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value={StockStatus.available}>Available</SelectItem>
        <SelectItem value={StockStatus.low}>Low stock</SelectItem>
        <SelectItem value={StockStatus.shortage}>Shortage</SelectItem>
        <SelectItem value={StockStatus.unavailable}>Unavailable</SelectItem>
      </SelectContent>
    </Select>
  );
}
