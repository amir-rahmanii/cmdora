import type { ReactNode } from "react";

export interface StatCardsProps {
  message: string;
  count: number;
  isDark: boolean;
}

export function StatCards({ message, count, isDark }: StatCardsProps): ReactNode {
  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-3">
      <article className="flex min-w-0 flex-col gap-[0.35rem] rounded-xl border border-[rgba(128,128,128,0.3)] bg-[rgba(128,128,128,0.04)] px-4 py-[0.9rem]">
        <span className="text-[0.72rem] tracking-[0.06em] uppercase opacity-60">Message</span>
        <p className="wrap-anywhere m-0 text-[1.05rem] font-semibold">{message}</p>
      </article>
      <article className="flex min-w-0 flex-col gap-[0.35rem] rounded-xl border border-[rgba(128,128,128,0.3)] bg-[rgba(128,128,128,0.04)] px-4 py-[0.9rem]">
        <span className="text-[0.72rem] tracking-[0.06em] uppercase opacity-60">Counter</span>
        <p className="wrap-anywhere m-0 text-[1.05rem] font-semibold">{count}</p>
      </article>
      <article className="flex min-w-0 flex-col gap-[0.35rem] rounded-xl border border-[rgba(128,128,128,0.3)] bg-[rgba(128,128,128,0.04)] px-4 py-[0.9rem]">
        <span className="text-[0.72rem] tracking-[0.06em] uppercase opacity-60">Theme</span>
        <p className="wrap-anywhere m-0 text-[1.05rem] font-semibold">
          {isDark ? "Dark" : "Light"}
        </p>
      </article>
    </section>
  );
}
