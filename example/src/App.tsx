import { useEffect, useState } from "react";
import { CommandInput, CommandList, CommandPalette, useCommandPalette, type Command } from "cmdora";

function SearchIcon() {
  return (
    <svg
      className="palette-search-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function App() {
  const [message, setMessage] = useState("No command run yet.");
  const [count, setCount] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
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
      id: "toggle-theme",
      name: "Toggle theme",
      execute: () => setIsDark((current) => !current),
    },
  ];

  const { isOpen, open, close, toggle } = useCommandPalette(commands);

  return (
    <main className="page">
      <header className="page-header">
        <div className="brand">
          <span className="brand-mark">⌘</span>
          <span className="brand-name">Cmdora</span>
          <span className="badge">Headless</span>
        </div>
        <p className="tagline">A lightweight, headless command palette for React.</p>
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

      <CommandPalette commands={commands} className="palette" backdropClassName="palette-backdrop">
        <div className="palette-search">
          <SearchIcon />
          <CommandInput className="palette-input" placeholder="Search commands..." autoFocus />
          <kbd className="palette-kbd">⌘K</kbd>
        </div>
        <div className="palette-body">
          <span className="palette-section-label">Commands</span>
          <CommandList className="palette-list" />
        </div>
      </CommandPalette>
    </main>
  );
}
