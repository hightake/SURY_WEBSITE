import { createRootRoute, createRoute, createRouter, Outlet, ScrollRestoration, useRouterState } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType } from "react";
import { redirectIfSignedIn, requireAdmin, requireOwner } from "./middleware/adminGuards";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { Accessibility } from "./pages/Accessibility";
import { Category } from "./pages/Category";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Privacy } from "./pages/Privacy";
import { Product } from "./pages/Product";
import { Stores } from "./pages/Stores";
import { Story } from "./pages/Story";

function Root() {
  const isAdmin = useRouterState({ select: (s) => /\/admin(\/|$)/.test(s.location.pathname) });
  if (isAdmin) return <Outlet />;
  return (
    <>
      <ScrollRestoration />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

const rootRoute = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
});

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Home });
const categoryRoute = createRoute({ getParentRoute: () => rootRoute, path: "/collection/$category", component: Category });
const productRoute = createRoute({ getParentRoute: () => rootRoute, path: "/product/$sku", component: Product });
  },
});
const storyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/our-story", component: Story });
const storesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/stores", component: Stores });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: "/contact", component: Contact });
const privacyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/privacy", component: Privacy });
const accessibilityRoute = createRoute({ getParentRoute: () => rootRoute, path: "/accessibility", component: Accessibility });

// ---------- Admin: lazy-loaded, protected by route middleware ----------
const adminModule = () => import("./admin/routes").then((m) => m.adminPages);
type AdminPage = keyof Awaited<ReturnType<typeof adminModule>>;
const lazyPage = (key: AdminPage) => {
  const C = lazy(() => adminModule().then((p) => ({ default: p[key] as ComponentType })));
  return () => (
    <Suspense fallback={null}>
      <C />
    </Suspense>
  );
};

const adminLoginRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin/login", beforeLoad: redirectIfSignedIn, component: lazyPage("SignIn") });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, id: "admin", beforeLoad: requireAdmin, component: lazyPage("AdminLayout") });
const adminPage = <P extends string>(path: P, key: AdminPage) => createRoute({ getParentRoute: () => adminRoute, path, component: lazyPage(key) });

const adminTree = adminRoute.addChildren([
  adminPage("/admin", "Overview"),
  adminPage("/admin/home", "HomeAdmin"),
  adminPage("/admin/categories", "CategoriesAdmin"),
  createRoute({
    getParentRoute: () => adminRoute,
    path: "/admin/products",
    validateSearch: (s: Record<string, unknown>): { featured?: boolean } => (s.featured ? { featured: true } : {}),
    component: lazyPage("ProductsAdmin"),
  }),
  adminPage("/admin/products/$cat/$slug", "ProductEdit"),
  adminPage("/admin/stores", "StoresAdmin"),
  adminPage("/admin/story", "StoryAdmin"),
  adminPage("/admin/legal", "LegalAdmin"),
  adminPage("/admin/settings", "SettingsAdmin"),
  createRoute({ getParentRoute: () => adminRoute, path: "/admin/users", beforeLoad: requireOwner, component: lazyPage("UsersAdmin") }),
]);

const routeTree = rootRoute.addChildren([adminLoginRoute, adminTree, homeRoute, categoryRoute, productRoute, storyRoute, storesRoute, contactRoute, privacyRoute, accessibilityRoute]);

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
