import { Card, ImageField, RowTools, Text, moveItem } from "../fields";
import { useAdmin } from "../store";

export function StoryAdmin() {
  const { data, update } = useAdmin();
  const st = data.pages.story;
  return (
    <div className="grid gap-6">
      <Card title="עמוד ״הסיפור שלנו״">
        <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
          <ImageField label="תמונה" value={st.image} onChange={(img) => update((d) => void (d.pages.story.image = img))} />
          <div className="grid content-start gap-5">
            <Text label="כותרת" value={st.title} onChange={(v) => update((d) => void (d.pages.story.title = v))} />
            <Text label="משפט פתיחה" value={st.lead} onChange={(v) => update((d) => void (d.pages.story.lead = v))} />
          </div>
        </div>
      </Card>
      <Card title="פסקאות">
        {st.paragraphs.map((para, i) => (
          <div key={i} className="grid gap-2">
            <Text label={`פסקה ${i + 1}`} value={para} multiline onChange={(v) => update((d) => void (d.pages.story.paragraphs[i] = v))} />
            <RowTools
              onUp={i > 0 ? () => update((d) => moveItem(d.pages.story.paragraphs, i, -1)) : undefined}
              onDown={i < st.paragraphs.length - 1 ? () => update((d) => moveItem(d.pages.story.paragraphs, i, 1)) : undefined}
              onDelete={() => update((d) => void d.pages.story.paragraphs.splice(i, 1))}
            />
          </div>
        ))}
        <button type="button" className="adm-btn justify-self-start" onClick={() => update((d) => void d.pages.story.paragraphs.push(""))}>+ הוספת פסקה</button>
      </Card>
    </div>
  );
}
