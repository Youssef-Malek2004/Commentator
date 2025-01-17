"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      style={{
        backgroundColor: theme === "dark" ? "rgb(67, 56, 202)" : "rgb(229, 231, 235)",
      }}
    >
      <span className="sr-only">Toggle theme</span>
      <div
        className={`${
          theme === "dark" ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
      >
        {theme === "dark" ? <Moon className="h-4 w-4 text-indigo-600" /> : <Sun className="h-4 w-4 text-gray-400" />}
      </div>
    </button>
  );
}
