import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { usePageTitle } from "../lib/usePageTitle";

export const NOT_FOUND_TITLE = "העמוד לא נמצא";

export function NotFound() {
  usePageTitle(NOT_FOUND_TITLE);
  // a missing page (e.g. a product that was removed) must not stay in search results
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
  return (
    <div className="container-x py-32 text-center">
      <p className="latin text-7xl text-accent">404</p>
      <h1 className="mt-4 text-3xl font-light">העמוד לא נמצא</h1>
      <Link to="/" className="btn btn-primary mt-10">לדף הבית</Link>
    </div>
  );
}
