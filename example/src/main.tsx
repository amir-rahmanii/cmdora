import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CmdoraProvider } from "cmdora";
import { App } from "./App.tsx";
import "cmdora/style.css";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <CmdoraProvider>
      <App />
    </CmdoraProvider>
  </StrictMode>,
);
