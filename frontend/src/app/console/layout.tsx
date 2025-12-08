"use client";

import { ConsoleSidebar } from "@/components/ConsoleSidebar";
import { ConsoleHeader } from "@/components/ConsoleHeader";
import { useState } from "react";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="h-screen">
      <ConsoleSidebar isOpen={isOpen} />
      <div className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-16"}`}>
        <div className="fixed top-0 right-0 left-0 z-10 bg-background transition-all duration-300">
          <ConsoleHeader isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
        </div>
        <main className="pt-[73px]">{children}</main>
      </div>
    </div>
  );
}
