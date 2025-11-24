"use client";

import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex w-full max-w-7xl h-full overflow-hidden">
      {/* Spacer for fixed sidebar on desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
      <Sidebar />
      <div className="w-full flex flex-1 flex-col overflow-hidden min-w-0 h-full lg:ml-0">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-background h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
