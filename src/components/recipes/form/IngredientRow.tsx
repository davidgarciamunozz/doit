"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function IngredientRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Ingredient ocupa 3/5 */}
      <div className="md:col-span-3">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ingredient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flour">Flour</SelectItem>
            <SelectItem value="sugar">Sugar</SelectItem>
            <SelectItem value="butter">Butter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quantity ocupa 1/5 */}
      <Input placeholder="Quantity" className="w-full md:col-span-1" />

      {/* Unit ocupa 1/5 */}
      <div className="md:col-span-1">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="g">g</SelectItem>
            <SelectItem value="kg">kg</SelectItem>
            <SelectItem value="ml">ml</SelectItem>
            <SelectItem value="cup">cup</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
