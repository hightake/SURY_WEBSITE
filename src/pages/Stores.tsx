import { StoresBlock } from "../components/home/StoresBlock";
import { usePageTitle } from "../lib/usePageTitle";

/* The stores page uses the same lit gates as the home-page stores section. */
export function Stores() {
  usePageTitle("החנויות שלנו");
  return <StoresBlock asPage />;
}
