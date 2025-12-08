import { Search, User, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ConsoleHeader({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <header className={`border-b bg-background p-4 transition-all duration-300 ${isOpen ? "ml-64" : "ml-16"}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Button size="icon" variant="ghost" onClick={onToggle}>
            {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </Button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9" />
            </div>
          </div>
        </div>
        <Button size="icon" variant="ghost">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
