"use client"
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { lang, changeLang, t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg leading-none tracking-tight">S</span>
          </div>
          <span className="font-semibold text-lg hidden sm:block tracking-tight text-foreground">
            {t("nav.title")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Lang Toggler */}
          <div className="flex items-center bg-muted/60 rounded-full p-1 border border-border">
            <button
              onClick={() => changeLang("tr")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                lang === "tr" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              TR
            </button>
            <button
              onClick={() => changeLang("en")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                lang === "en" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggler */}
          {mounted && (
            <div className="flex items-center bg-muted/60 rounded-full p-1 border border-border">
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-full transition-all ${theme === "light" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-full transition-all ${theme === "system" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-full transition-all ${theme === "dark" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
