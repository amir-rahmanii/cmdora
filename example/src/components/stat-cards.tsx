import type { ReactNode } from "react";

export interface StatCardsProps {
  message: string;
  count: number;
  isDark: boolean;
}

export function StatCards({ message, count, isDark }: StatCardsProps): ReactNode {
  return (
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
  );
}
