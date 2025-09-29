"use client";

import AddButton from "@/components/buttons/add-button";
import { Input } from "@/components/ui/input";

export default function InstructionsSection() {
  return (
    <section className="space-y-4">
      <h3 className="font-bold text-lg">Instructions</h3>

      <div className="space-y-2">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center gap-3">
            <span className="w-6 text-gray-500 font-mono">
              {String(step).padStart(2, "0")}
            </span>
            <Input placeholder={`Step ${step}`} />
          </div>
        ))}
      </div>

      <AddButton label="Add step" variant="light-green" />
    </section>
  );
}
