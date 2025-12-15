import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Star } from "lucide-react";

export function AppHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">FO</span>
          </div>
          <span className="font-semibold text-lg">Fibo Orchestra</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link 
            href="https://github.com/monodox/fibo-orchestra" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Star</span>
            </Button>
          </Link>
          <Link 
            href="https://github.com/monodox/fibo-orchestra" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
