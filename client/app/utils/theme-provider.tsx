"use client";

import { FC, ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
};
