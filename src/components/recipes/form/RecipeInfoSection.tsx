"use client";

import { Input } from "@/components/ui/input";

export default function RecipeInfoSection() {
  return (
    <section className="space-y-4">
      <h3 className="font-bold text-lg">Recipe Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input placeholder="Recipe Name" />
        <Input placeholder="Portion size" />
        <Input placeholder="Preparation time" />
        <Input placeholder="Price" />
      </div>
    </section>
  );
}
