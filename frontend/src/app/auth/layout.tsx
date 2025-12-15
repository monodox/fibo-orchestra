import type { Metadata } from "next";
import { BaseLayout } from "@/components/BaseLayout";

export const metadata: Metadata = {
  title: "Authentication - Fibo Orchestra",
  description: "Sign in to your Fibo Orchestra account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-16 pb-20">
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </BaseLayout>
  );
}
