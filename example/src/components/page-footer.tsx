import type { ReactNode } from "react";

export function PageFooter(): ReactNode {
  return (
    <footer className="flex gap-4">
      <a
        className="text-[0.85rem] text-inherit no-underline opacity-60 hover:opacity-100 hover:underline focus-visible:opacity-100 focus-visible:underline"
        href="https://github.com/amir-rahmanii/cmdora"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
      <a
        className="text-[0.85rem] text-inherit no-underline opacity-60 hover:opacity-100 hover:underline focus-visible:opacity-100 focus-visible:underline"
        href="https://www.npmjs.com/package/cmdora"
        target="_blank"
        rel="noreferrer"
      >
        npm
      </a>
    </footer>
  );
}
