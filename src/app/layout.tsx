import type { Metadata } from "next";
import "@/index.css";
import AppLayout from "@/layouts/AppLayout";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "EventFlow",
  description: "Plateforme événementielle temps réel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
