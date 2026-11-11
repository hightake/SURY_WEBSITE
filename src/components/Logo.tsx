import logoSvg from "../assets/logo.svg?raw";

/** The SURY logo as inline SVG, so it takes the surrounding text colour. */
export function Logo({ className = "" }: { className?: string }) {
  return <span className={`block [&>svg]:h-full [&>svg]:w-auto ${className}`} dangerouslySetInnerHTML={{ __html: logoSvg }} />;
}
