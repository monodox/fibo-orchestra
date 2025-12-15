import type { Metadata } from "next";
import { BaseLayout } from "@/components/BaseLayout";

export const metadata: Metadata = {
  title: "Legal - Fibo Orchestra",
  description: "Legal information and policies",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout className="pt-16 pb-20">
      {children}
    </BaseLayout>
  );
}
