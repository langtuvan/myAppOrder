import type React from "react";
import { Logo } from "./logo";
import ThemeToggle from "./ThemeToggle";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col p-2">
      <div className="flex grow items-center justify-center p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="grid w-full max-w-sm grid-cols-1 gap-6">
          <div className="flex flex-row justify-between items-center">
            <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />{" "}
            <ThemeToggle  />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
