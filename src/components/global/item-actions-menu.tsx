"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export type ItemAction = {
  label: string;
  onSelect: () => void;
};

type ItemActionsMenuProps = {
  actions: ItemAction[];
  trigger?: React.ReactNode;
};

export default function ItemActionsMenu({
  actions,
  trigger,
}: ItemActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {trigger ?? (
          <button
            type="button"
            aria-label="More options"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {actions.map((action, idx) => (
          <DropdownMenuItem key={action.label + idx} onSelect={action.onSelect}>
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
