import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/theme-provider";
import { NextAuthProvider } from "./utils/session-provider";
import { StoreProvider } from "./utils/store-provider";
import SocketProvider from "./utils/socket-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillHub — Learn with clarity",
  description:
    "A premium learning platform for ambitious professionals. Expert-led courses, structured paths, and tools designed for deep focus.",
  keywords: ["SkillHub", "learning", "courses", "skills", "career growth"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground"
      >
        <NextAuthProvider>
          <StoreProvider>
            <ThemeProvider>
              <SocketProvider />
              {children}
            </ThemeProvider>
          </StoreProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
