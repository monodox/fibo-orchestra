"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Folder, Laptop, Clock, Plug, Settings, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/console/dashboard", label: "Dashboard", icon: Activity },
  { href: "/console/projects", label: "Projects", icon: Folder },
  { href: "/console/generate", label: "Generate", icon: Laptop },
  { href: "/console/history", label: "History", icon: Clock },
  { href: "/console/integrations", label: "Integrations", icon: Plug },
  { href: "/console/docs", label: "Docs", icon: BookOpen },
  { href: "/console/settings", label: "Settings", icon: Settings },
];

export function ConsoleSidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen border-r bg-muted/40 flex flex-col z-20 transition-all duration-300",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="h-[73px] flex items-center px-4 border-b">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-xl font-bold">Fibo Orchestra</h2>
          </div>
        ) : (
          <Sparkles className="w-6 h-6 mx-auto" />
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md text-sm transition-colors mx-2",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
                isOpen ? "gap-3 px-3 py-2" : "justify-center p-2"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
