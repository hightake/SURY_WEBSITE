/* Admin form controls – presentation only; data changes go through the services. */
import { useId, useRef, useState, type ReactNode } from "react";
import { imgSmUrl, imgUrl } from "../../lib/media";
import type { Img } from "../../models/content";
import { moveItem } from "../../lib/list";
import { uploadImage } from "../../services/imageService";

export function Card({ title, hint, children, actions }: { title?: string; hint?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="adm-card">
      {(title || actions) && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-lg font-medium">{title}</h2>}
            {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

export function Text({ label, value, onChange, hint, multiline, dir, placeholder }: { label: string; value: string; onChange: (v: string) => void; hint?: string; multiline?: boolean; dir?: "ltr" | "rtl"; placeholder?: string }) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      {multiline ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={3} dir={dir} placeholder={placeholder} className="adm-input min-h-24 resize-y" />
      ) : (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} dir={dir} placeholder={placeholder} className="adm-input" />
      )}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <span className={`adm-switch ${checked ? "is-on" : ""}`}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      </span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="adm-input">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/** Pick a file, resize it and store it through the backend. */
export function useUpload() {
  const [busy, setBusy] = useState(false);
  const upload = async (file: File, alt: string) => {
    setBusy(true);
    try {
      return await uploadImage(file, alt);
    } finally {
      setBusy(false);
    }
  };
  return { busy, upload };
}

function UploadButton({ label, onFiles, multiple, busy }: { label: string; onFiles: (f: File[]) => void; multiple?: boolean; busy?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" className="adm-btn" onClick={() => ref.current?.click()} disabled={busy}>
        {busy ? "מעלה…" : label}
      </button>
      <input ref={ref} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={(e) => {
        const files = [...(e.target.files ?? [])];
        e.target.value = "";
        if (files.length) onFiles(files);
      }} />
    </>
  );
}

/** One image with its alt text. */
export function ImageField({ label, value, onChange, hint, aspect = "4 / 5" }: { label: string; value: Img | undefined; onChange: (img: Img) => void; hint?: string; aspect?: string }) {
  const { busy, upload } = useUpload();
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-start gap-4">
        <div className="adm-thumb w-32" style={{ aspectRatio: aspect }}>
          {value ? <img src={imgUrl(value.src)} alt="" className={aspect === "1 / 1" ? "!object-contain p-2" : ""} /> : <span className="text-xs text-muted">אין תמונה</span>}
        </div>
        <div className="grid min-w-52 flex-1 gap-2">
          <UploadButton label={value ? "החלפת תמונה" : "העלאת תמונה"} busy={busy} onFiles={async ([f]) => onChange(await upload(f, value?.alt ?? ""))} />
          {value && <Text label="תיאור התמונה (לנגישות)" value={value.alt} onChange={(alt) => onChange({ ...value, alt })} hint="מה רואים בתמונה – מוקרא לעיוורים ולמנועי חיפוש" />}
        </div>
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

/** Several images: the first is the main one; reorder, set main, remove, alt text. */
export function ImagesField({ value, onChange }: { value: Img[]; onChange: (imgs: Img[]) => void }) {
  const { busy, upload } = useUpload();
  const move = (i: number, d: number) => {
    const next = [...value];
    moveItem(next, i, d);
    onChange(next);
  };
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">תמונות המוצר</p>
        <UploadButton label="הוספת תמונות" multiple busy={busy} onFiles={async (files) => {
          const added = [];
          for (const f of files) added.push(await upload(f, ""));
          onChange([...value, ...added]);
        }} />
      </div>
      <p className="text-xs text-muted">התמונה הראשונה היא הראשית – היא מופיעה בכרטיס המוצר ובקולקציה. מומלץ לצלם אנכי (4:5).</p>
      {value.length === 0 && <p className="rounded-lg border border-dashed border-shade p-6 text-center text-sm text-muted">עוד אין תמונות</p>}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {value.map((im, i) => (
          <li key={im.src.slice(-40) + i} className={`rounded-lg border p-3 ${i === 0 ? "border-accent bg-accent/5" : "border-shade"}`}>
            <div className="adm-thumb w-full" style={{ aspectRatio: "4 / 5" }}>
              <img src={imgSmUrl(im.src)} alt="" />
              {i === 0 && <span className="adm-badge absolute right-2 top-2">ראשית</span>}
            </div>
            <input value={im.alt} onChange={(e) => onChange(value.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))} placeholder="תיאור התמונה (לנגישות)" className="adm-input mt-2 text-sm" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {i > 0 && <button type="button" className="adm-chip" onClick={() => onChange([im, ...value.filter((_, k) => k !== i)])}>הגדרה כראשית</button>}
              {i > 0 && <button type="button" className="adm-chip" onClick={() => move(i, -1)} aria-label="הזזה קדימה">→</button>}
              {i < value.length - 1 && <button type="button" className="adm-chip" onClick={() => move(i, 1)} aria-label="הזזה אחורה">←</button>}
              <button type="button" className="adm-chip text-primary" onClick={() => confirm("למחוק את התמונה?") && onChange(value.filter((_, k) => k !== i))}>מחיקה</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Small up/down/delete controls for list rows. */
export function RowTools({ onUp, onDown, onDelete, deleteLabel = "מחיקה" }: { onUp?: () => void; onDown?: () => void; onDelete?: () => void; deleteLabel?: string }) {
  return (
    <div className="flex gap-1.5">
      {onUp && <button type="button" className="adm-chip" onClick={onUp} aria-label="למעלה">↑</button>}
      {onDown && <button type="button" className="adm-chip" onClick={onDown} aria-label="למטה">↓</button>}
      {onDelete && <button type="button" className="adm-chip text-primary" onClick={() => confirm("למחוק?") && onDelete()}>{deleteLabel}</button>}
    </div>
  );
}

