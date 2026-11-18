import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "../../components/Logo";
import { isPreviewBackend } from "../../services/environment";
import { NotAllowedError, signIn } from "../../services/authService";
import { useNoIndex } from "../layout/AdminLayout";

export function SignIn() {
  useNoIndex("כניסה לניהול | SURY");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const isMock = isPreviewBackend;
  const go = async () => {
    setError("");
    try {
      await signIn(email);
      navigate({ to: "/admin" });
    } catch (e) {
      setError(e instanceof NotAllowedError ? e.message : "הכניסה נכשלה, נסי שוב");
    }
  };
  return (
    <div className="adm-root grid min-h-svh place-items-center p-5">
      <div className="adm-card w-full max-w-sm text-center">
        <Logo className="mx-auto h-12" />
        <h1 className="mt-6 text-2xl font-light">ניהול האתר</h1>
        <p className="mt-2 text-sm text-muted">הכניסה למורשות בלבד, עם חשבון Google.</p>
        {isMock && (
          <div className="mt-6 grid gap-2 text-start">
            <label htmlFor="demo-email" className="text-sm font-medium">מייל Google <span className="text-xs text-muted">(הדמיה)</span></label>
            <input id="demo-email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} className="adm-input" placeholder="name@gmail.com" autoComplete="email" />
          </div>
        )}
        <button type="button" onClick={go} className="adm-google mt-4">
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2-1.9 3.2-4.7 3.2-8.2Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 10l3.7-2.9Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4Z"/></svg>
          כניסה עם Google
        </button>
        {error && <p role="alert" className="mt-4 text-sm text-primary">{error}</p>}
        {isMock && <p className="mt-6 text-xs leading-relaxed text-muted">בתצוגה המקדימה הכניסה מדומה ונשמרת בדפדפן הזה בלבד. באתר האמיתי – חלון של Google, ואבטחה בצד השרת.</p>}
      </div>
    </div>
  );
}
