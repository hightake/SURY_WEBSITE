import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { backend } from "./lib/backend";
import { applyContent } from "./lib/content";
import { router } from "./router";
import "./styles.css";

// Load the content first, so every page renders the current version.
backend
  .loadContent()
  .then(applyContent)
  .catch(() => {
    /* keep the bundled content */
  })
  .finally(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
    );
  });
