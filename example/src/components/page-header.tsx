import type { ReactNode } from "react";

export function PageHeader(): ReactNode {
  return (
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
  );
}
