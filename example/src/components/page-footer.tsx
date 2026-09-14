import type { ReactNode } from "react";

export function PageFooter(): ReactNode {
  return (
    <footer className="page-footer">
      <a
        className="footer-link"
        href="https://github.com/amir-rahmanii/cmdora"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
      <a
        className="footer-link"
        href="https://www.npmjs.com/package/cmdora"
        target="_blank"
        rel="noreferrer"
      >
        npm
      </a>
    </footer>
  );
}
