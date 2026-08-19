import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ProgressProvider } from "@/components/providers/progress-provider";

export const metadata: Metadata = {
  title: "English Sin Trabas",
  description: "Tu tutor personal para pensar y expresarte en inglés.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ProgressProvider>
            <AppShell>{children}</AppShell>
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
