"use client"
import * as React from "react"
import { ThemeProvider } from "next-themes"
import { LanguageProvider } from "@/hooks/useTranslation"

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  )
}
