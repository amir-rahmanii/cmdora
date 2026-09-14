import type { ReactNode } from "react";

// Cmdora ships CommandInput as a plain, unopinionated input: no icon, no
// wrapper. This SVG and the wrapper around it live entirely in the example
// to demonstrate how a consumer composes their own UI around it.
export function SearchIcon(): ReactNode {
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
