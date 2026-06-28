import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

async function prepare() {
  // MSW must run in BOTH dev and preview.
  // `import.meta.env.DEV` is false in `vite preview` (it serves the prod build),
  // so the old guard `if (DEV)` silently skipped the mock worker — causing blank data.
  //
  // Fix: start MSW unconditionally unless the operator sets VITE_DISABLE_MSW=true.
  // That flag lets a real production deploy skip the mock layer entirely.
  const mswDisabled = import.meta.env.VITE_DISABLE_MSW === "true";

  if (!mswDisabled) {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
      // Suppress the MSW startup banner outside of dev
      quiet: !import.meta.env.DEV,
    });
  }
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
