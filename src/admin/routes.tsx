/* Admin page components, loaded lazily by the router only when /admin is opened. */
import AdminLayout from "./layout/AdminLayout";
import { CategoriesAdmin } from "./pages/CategoriesAdmin";
import { HomeAdmin } from "./pages/HomeAdmin";
import { LegalAdmin } from "./pages/LegalAdmin";
import { Overview } from "./pages/Overview";
import { ProductEdit } from "./pages/ProductEdit";
import { ProductsAdmin } from "./pages/ProductsAdmin";
import { SettingsAdmin } from "./pages/SettingsAdmin";
import { SignIn } from "./pages/SignIn";
import { StoresAdmin } from "./pages/StoresAdmin";
import { StoryAdmin } from "./pages/StoryAdmin";
import { UsersAdmin } from "./pages/UsersAdmin";

export const adminPages = { AdminLayout, SignIn, Overview, HomeAdmin, CategoriesAdmin, ProductsAdmin, ProductEdit, StoresAdmin, StoryAdmin, LegalAdmin, SettingsAdmin, UsersAdmin };
