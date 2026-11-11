import { TextPage } from "../components/TextPage";
import { site, telLink } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";

export function Accessibility() {
  usePageTitle("הצהרת נגישות");
  return (
    <TextPage title="הצהרת נגישות">
      <p>SURY רואה חשיבות במתן שירות שוויוני לכל הלקוחות, ופועלת להנגשת האתר לפי תקן ישראלי 5568, ברמה AA של הנחיות WCAG 2.0.</p>
      <h2>מה הונגש באתר</h2>
      <ul>
        <li>מבנה כותרות היררכי וניווט מלא במקלדת, כולל קישור "דילוג לתוכן".</li>
        <li>טקסט חלופי לתמונות.</li>
        <li>ניגודיות צבעים תקינה בין טקסט לרקע.</li>
        <li>התאמה למסכים בכל הגדלים ולהגדלת טקסט.</li>
        <li>כיבוד הגדרת "הפחתת תנועה" של המכשיר.</li>
      </ul>
      <h2>נתקלת בבעיה?</h2>
      <p>
        אם משהו באתר אינו נגיש עבורך, נשמח לשמוע ולתקן. אפשר לפנות בטלפון <a href={telLink(site.settings.phone)} dir="ltr">{site.settings.phone}</a> או במייל{" "}
        <a href={`mailto:${site.settings.email}`}>{site.settings.email}</a>.
      </p>
      <p className="text-sm text-muted">שם רכזת הנגישות ותאריך הבדיקה האחרונה יעודכנו לפני העלייה לאוויר.</p>
    </TextPage>
  );
}
