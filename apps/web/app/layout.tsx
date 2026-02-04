import { AuthGuard } from "@/components/AuthGuard";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import theme from "@/lib/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import type { ComponentType } from "react";
import "./globals.css";

const CacheProvider = AppRouterCacheProvider as ComponentType<{ children: React.ReactNode }>;

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Omni Site",
  description: "Next.js + NestJS + MUI + Zod template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CacheProvider>
          <ThemeProvider theme={theme}>
            <QueryProvider>
              <AuthProvider>
                <AuthGuard>{children}</AuthGuard>
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
