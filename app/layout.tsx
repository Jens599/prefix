import type { Metadata } from "next";
import { Tektur, Amita } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const tektur = Tektur({
  weight: ["400", "700"],
  variable: "--font-tektur",
  subsets: ["latin"],
});
const amita = Amita({
  weight: ["700"],
  variable: "--font-amita",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prefix.",
  description: "Quick Use All the Search Engines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${tektur.variable} ${amita.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
