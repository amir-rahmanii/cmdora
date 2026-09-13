import { useEffect, useState } from "react";
import {
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandPalette,
  useCommandPalette,
  type Command,
  type CommandEmptyProps,
} from "cmdora";

// Cmdora ships CommandInput as a plain, unopinionated input: no icon, no
// wrapper. This SVG and the wrapper below live entirely in the example to
// demonstrate how a consumer composes their own UI around it.
function SearchIcon() {
  return (
    <svg
      className="example-search-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// Demonstrates customizing CommandList's empty state: CommandEmpty is the
// library's default-styled building block, and CommandEmptyProps lets this
// wrapper stay fully typed while overriding only its content.
function NoMatchingCommands(props: CommandEmptyProps) {
  return <CommandEmpty {...props}>No matching commands. Try a different search.</CommandEmpty>;
}

function usePrefersDarkColorScheme(): boolean {
  const [prefersDark, setPrefersDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange(event: MediaQueryListEvent): void {
      setPrefersDark(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersDark;
}

type ThemeOverride = "light" | "dark" | null;

export function App() {
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
      <header className="page-header">
        <div className="brand">
          <span className="brand-mark">⌘</span>
          <span className="brand-name">Cmdora Example</span>
          <span className="badge">Styled by default</span>
        </div>
        <p className="tagline">
          A lightweight command palette for React — styled by default, customizable when needed.
        </p>
      </header>

      <section className="cards">
        <article className="card">
          <span className="card-label">Message</span>
          <p className="card-value">{message}</p>
        </article>
        <article className="card">
          <span className="card-label">Counter</span>
          <p className="card-value">{count}</p>
        </article>
        <article className="card">
          <span className="card-label">Theme</span>
          <p className="card-value">{isDark ? "Dark" : "Light"}</p>
        </article>
      </section>

      <p className="theme-hint">
        This page follows your OS color scheme by default. Run the "Toggle theme" command to
        override it manually.
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
          <NoMatchingCommands />
        </CommandList>
      </CommandPalette>
    </main>
  );
}
