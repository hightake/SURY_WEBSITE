import { Link } from "@tanstack/react-router";
import { usePageTitle } from "../lib/usePageTitle";

export function NotFound() {
  usePageTitle("העמוד לא נמצא");
  return (
    <div className="container-x py-32 text-center">
      <p className="latin text-7xl text-accent">404</p>
      <h1 className="mt-4 text-3xl font-light">העמוד לא נמצא</h1>
      <Link to="/" className="btn btn-primary mt-10">לדף הבית</Link>
    </div>
  );
}
