import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function BaseLayout({ children, className = "" }: BaseLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
