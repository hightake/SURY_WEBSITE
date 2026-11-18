import { useAdmin } from "../state/AdminStore";
import { RichTextEditor } from "../ui/RichTextEditor";
import { Card, ImageField, Text } from "../ui/fields";

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
      <Card>
        <RichTextEditor label="הסיפור" value={st.body} onChange={(v) => update((d) => void (d.pages.story.body = v))} />
      </Card>
    </div>
  );
}

