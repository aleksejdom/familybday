"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Theme wechseln"
      className="relative h-9 w-9 flex items-center justify-center rounded-xl
        bg-white/40 dark:bg-white/10 border border-border/60
        hover:bg-white/70 dark:hover:bg-white/20
        transition-all duration-200 hover:scale-105 active:scale-95"
    >
      <Sun className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`} />
      <Moon className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`} />
    </button>
  );
}
