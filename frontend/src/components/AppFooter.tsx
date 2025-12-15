import Link from "next/link";
import { Github } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>© 2025 Fibo Orchestra</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link 
              href="https://github.com/monodox/fibo-orchestra" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link 
              href="/legal/terms" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link 
              href="/legal/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/legal/cookies" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
