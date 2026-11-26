import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { App } from "./App.tsx";
import { ConfirmProvider } from "./components/ConfirmDialog.tsx";
import "./styles/index.css";
import "./styles/update-notice.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");

// Rendered at once, before DOMContentLoaded, so the shared scripts that look
// for their buttons then (theme.js, get-app.js) find them.
flushSync(() => {
  createRoot(root).render(
    <StrictMode>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </StrictMode>,
  );
});

// The offline copy (src/sw.ts, built as sw.js).
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
