import { useEffect, useState, type ReactNode } from "react";
import { useCommandPalette, type Command } from "cmdora";
import { PageHeader } from "./components/page-header.tsx";
import { StatCards } from "./components/stat-cards.tsx";
import { PageFooter } from "./components/page-footer.tsx";
import { CommandPaletteDemo } from "./components/command-palette-demo.tsx";
import { usePrefersDarkColorScheme } from "./hooks/use-prefers-dark-color-scheme.ts";

type ThemeOverride = "light" | "dark" | null;

const kbdClassName =
  "rounded-[5px] border border-[rgba(128,128,128,0.5)] border-b-2 bg-[rgba(128,128,128,0.08)] px-[0.4rem] py-[0.1rem] text-[0.8em] [font-family:inherit]";

export function App(): ReactNode {
  const [message, setMessage] = useState("No command run yet.");
  const [count, setCount] = useState(0);
  const prefersDark = usePrefersDarkColorScheme();
  const [themeOverride, setThemeOverride] = useState<ThemeOverride>(null);
  const isDark = themeOverride === null ? prefersDark : themeOverride === "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  const commands: Command[] = [
    {
      id: "say-hello",
      name: "Say hello",
      execute: () => setMessage("Hello from Cmdora!"),
    },
    {
      id: "increment-counter",
      name: "Increment counter",
      execute: () => setCount((current) => current + 1),
    },
    {
      id: "reset-counter",
      name: "Reset counter",
      execute: () => setCount(0),
    },
    {
      id: "toggle-theme",
      name: "Toggle theme",
      execute: () => setThemeOverride(isDark ? "light" : "dark"),
    },
    {
      id: "disabled-command",
      name: "Disabled command",
      disabled: true,
      execute: () => setMessage("This should not execute"),
    },
  ];

  const { isOpen, open, close, toggle } = useCommandPalette();

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-7">
      <PageHeader />
      <StatCards message={message} count={count} isDark={isDark} />

      <p className="m-0 rounded-[10px] border border-dashed border-[rgba(128,128,128,0.4)] px-4 py-3 text-[0.85rem] opacity-75">
        This page follows your OS color scheme by default. Run the &quot;Toggle theme&quot; command
        to override it manually.
      </p>

      <div className="flex flex-wrap items-center gap-[0.6rem]">
        <button
          type="button"
          className="cursor-pointer rounded-[10px] bg-[#16161a] px-5 py-[0.65rem] font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.18)] hover:bg-[#2a2a30] dark:bg-[#f2f2f4] dark:text-[#16161a] dark:hover:bg-[#dcdce0]"
          onClick={open}
        >
          Open Command Palette
        </button>
        {isOpen && (
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(128,128,128,0.4)] bg-transparent px-[1.1rem] py-[0.65rem] text-inherit hover:bg-[rgba(128,128,128,0.1)]"
            onClick={close}
          >
            Close
          </button>
        )}
      </div>

      <button
        type="button"
        className="flex cursor-pointer flex-wrap items-center gap-[0.3rem] self-start text-start text-[0.88rem] text-inherit opacity-75 hover:opacity-100 focus-visible:opacity-100"
        onClick={toggle}
      >
        Press <kbd className={kbdClassName}>Ctrl</kbd> <kbd className={kbdClassName}>K</kbd> or{" "}
        <kbd className={kbdClassName}>⌘</kbd> <kbd className={kbdClassName}>K</kbd> to open the
        command palette
      </button>

      <CommandPaletteDemo commands={commands} />

      <PageFooter />
    </main>
  );
}
