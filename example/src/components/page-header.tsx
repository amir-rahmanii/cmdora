import type { ReactNode } from "react";

export function PageHeader(): ReactNode {
  return (
    <header className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[1.4rem]">⌘</span>
        <span className="text-[1.4rem] font-bold tracking-[-0.01em]">Cmdora Example</span>
        <span className="rounded-full border border-[rgba(128,128,128,0.4)] px-2 py-[0.2rem] text-[0.7rem] font-semibold tracking-[0.06em] uppercase opacity-75">
          Styled by default
        </span>
      </div>
      <p className="m-0 text-[0.95rem] opacity-70">
        A lightweight command palette for React — styled by default, customizable when needed.
      </p>
    </header>
  );
}
