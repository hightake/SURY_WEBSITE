import type { SiteData, Store } from "../models/content";

export const newStore = (d: SiteData): Store => ({ city: "חנות חדשה", address: "", phone: d.settings.phone, hours: [["א׳–ה׳", "10:00–20:00"]], navQuery: "" });

/** Stores where customers can try products on (wholesale excluded). */
export const retailStores = (stores: Store[]) => stores.filter((s) => !s.wholesale);
