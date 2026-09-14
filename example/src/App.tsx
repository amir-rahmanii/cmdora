import { useEffect, useState, type ReactNode } from "react";
import {
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandPalette,
  useCommandPalette,
  type Command,
} from "cmdora";
import { SearchIcon } from "./components/search-icon.tsx";
import { PageHeader } from "./components/page-header.tsx";
import { StatCards } from "./components/stat-cards.tsx";
import { PageFooter } from "./components/page-footer.tsx";
import { usePrefersDarkColorScheme } from "./hooks/use-prefers-dark-color-scheme.ts";

type ThemeOverride = "light" | "dark" | null;

export function App(): ReactNode {
  const [message, setMessage] = useState("No command run yet.");
  const [count, setCount] = useState(0);
  const prefersDark = usePrefersDarkColorScheme();
  const [themeOverride, setThemeOverride] = useState<ThemeOverride>(null);
  const isDark = themeOverride === null ? prefersDark : themeOverride === "dark";

  useEffect(() => {
    if (themeOverride === null) {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = themeOverride;
    }
  }, [themeOverride]);

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
  ];

  const { isOpen, open, close, toggle } = useCommandPalette();

  return (
    <main className="page">
      <PageHeader />
      <StatCards message={message} count={count} isDark={isDark} />

      <p className="theme-hint">
        This page follows your OS color scheme by default. Run the &quot;Toggle theme&quot; command
        to override it manually.
      </p>

      <div className="actions">
        <button type="button" className="primary-button" onClick={open}>
          Open Command Palette
        </button>
        {isOpen && (
          <button type="button" className="ghost-button" onClick={close}>
            Close
          </button>
        )}
      </div>

      <button type="button" className="kbd-hint" onClick={toggle}>
        Press <kbd>Ctrl</kbd> <kbd>K</kbd> or <kbd>⌘</kbd> <kbd>K</kbd> to open the command palette
      </button>

      {/*
        No className/backdropClassName here: CommandPalette ships a polished
        default appearance out of the box. Both props stay available for
        consumers who want to customize it (see components.test.tsx).
      */}
      <CommandPalette commands={commands}>
        <div className="example-input-wrapper">
          <SearchIcon />
          <CommandInput className="example-input" placeholder="Search commands..." autoFocus />
        </div>
        <CommandList>
          <CommandEmpty>No matching commands. Try a different search.</CommandEmpty>
        </CommandList>
      </CommandPalette>

      <PageFooter />
    </main>
  );
}
