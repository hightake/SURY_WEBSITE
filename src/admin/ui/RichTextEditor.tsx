/*
 * Word-like editor for long texts (story, privacy, accessibility).
 * Produces clean HTML; the site sanitises it before showing it.
 */
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useId, useRef, type ReactNode } from "react";

export function RichTextEditor({ label, value, onChange, hint }: { label: string; value: string; onChange: (html: string) => void; hint?: string }) {
  const id = useId();
  const lastHtml = useRef(value); // what the editor last produced
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, codeBlock: false, code: false, blockquote: false, horizontalRule: false, strike: false, link: false })],
    content: value,
    editorProps: { attributes: { class: "rich-text adm-editor", dir: "rtl", "aria-labelledby": id } },
    onUpdate: ({ editor }) => {
      lastHtml.current = editor.isEmpty ? "" : editor.getHTML();
      onChange(lastHtml.current);
    },
  });

  // reflect outside changes (e.g. reset) without disturbing typing
  useEffect(() => {
    if (!editor || editor.isDestroyed || value === lastHtml.current) return;
    lastHtml.current = value;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e && {
        size: e.isActive("heading", { level: 2 }) ? "h2" : e.isActive("heading", { level: 3 }) ? "h3" : "p",
        bold: e.isActive("bold"),
        italic: e.isActive("italic"),
        underline: e.isActive("underline"),
        bullet: e.isActive("bulletList"),
        ordered: e.isActive("orderedList"),
        canUndo: e.can().undo(),
        canRedo: e.can().redo(),
      },
  });

  if (!editor || !state) return null;
  const chain = () => editor.chain().focus();

  return (
    <div className="grid gap-1.5">
      <p id={id} className="text-sm font-medium">{label}</p>
      <div className="overflow-hidden rounded-lg border border-[#dccbb5] bg-white focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(110,18,24,0.12)]">
        <div role="toolbar" aria-label="עיצוב טקסט" className="flex flex-wrap items-center gap-1 border-b border-[#eadfce] bg-[#fbf7f1] p-1.5">
          <select
            aria-label="גודל"
            value={state.size}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "p") chain().setParagraph().run();
              else chain().setHeading({ level: v === "h2" ? 2 : 3 }).run();
            }}
            className="rounded-md border border-[#e3d5c3] bg-white px-2 py-1 text-sm"
          >
            <option value="p">טקסט רגיל</option>
            <option value="h2">כותרת</option>
            <option value="h3">כותרת קטנה</option>
          </select>
          <Sep />
          <Btn label="מודגש" active={state.bold} onClick={() => chain().toggleBold().run()}><b>B</b></Btn>
          <Btn label="נטוי" active={state.italic} onClick={() => chain().toggleItalic().run()}><i className="font-serif">I</i></Btn>
          <Btn label="קו תחתון" active={state.underline} onClick={() => chain().toggleUnderline().run()}><u>U</u></Btn>
          <Sep />
          <Btn label="רשימת נקודות" active={state.bullet} onClick={() => chain().toggleBulletList().run()}>
            <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden><circle cx="16" cy="5" r="1.6" /><circle cx="16" cy="10" r="1.6" /><circle cx="16" cy="15" r="1.6" /><rect x="2" y="4.2" width="10" height="1.6" rx=".8" /><rect x="2" y="9.2" width="10" height="1.6" rx=".8" /><rect x="2" y="14.2" width="10" height="1.6" rx=".8" /></svg>
          </Btn>
          <Btn label="רשימה ממוספרת" active={state.ordered} onClick={() => chain().toggleOrderedList().run()}>
            <span className="text-xs font-medium">1.2.</span>
          </Btn>
          <Btn label="הזחה פנימה" onClick={() => chain().sinkListItem("listItem").run()}>⇤</Btn>
          <Btn label="הזחה החוצה" onClick={() => chain().liftListItem("listItem").run()}>⇥</Btn>
          <Sep />
          <Btn label="ביטול" disabled={!state.canUndo} onClick={() => chain().undo().run()}>↶</Btn>
          <Btn label="ביצוע שוב" disabled={!state.canRedo} onClick={() => chain().redo().run()}>↷</Btn>
        </div>
        <EditorContent editor={editor} />
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Btn({ label, active, disabled, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={onClick}
      className={`grid h-8 min-w-8 place-items-center rounded-md px-1.5 text-sm transition-colors disabled:opacity-35 ${active ? "bg-primary text-white" : "hover:bg-[#efe4d6]"}`}>
      {children}
    </button>
  );
}
const Sep = () => <span aria-hidden className="mx-1 h-5 w-px bg-[#e3d5c3]" />;
