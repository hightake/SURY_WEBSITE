import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router";
import { bootContent } from "./services/contentService";
import "./styles.css";
import { initContrastPreview } from "./lib/contrastPreview";

initContrastPreview(); // TEMPORARY – remove after the colour is chosen

// Load the content first, so every page renders the current version.
bootContent().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
});
