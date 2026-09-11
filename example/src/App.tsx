import { useEffect, useState } from "react";
import { CommandInput, CommandList, CommandPalette, useCommandPalette, type Command } from "cmdora";

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
        <CommandInput placeholder="Search commands..." autoFocus />
        <CommandList />
      </CommandPalette>
    </main>
  );
}
