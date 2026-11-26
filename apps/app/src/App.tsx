import { DEFAULT_META, PAPER_VERSION } from "@prashna/paper";

// Placeholder until the editor is ported (#48). Not served yet: scripts/assemble.mjs
// still serves the current app from www/app/.
export function App() {
  return (
    <main>
      <h1>Prashna</h1>
      <p>
        React app scaffold. Paper format {PAPER_VERSION}; default subject {DEFAULT_META.subject}.
      </p>
    </main>
  );
}
