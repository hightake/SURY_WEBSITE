import { createRootRoute, createRoute, createRouter, Outlet, ScrollRestoration, useRouterState } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType } from "react";
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
const productRoute = createRoute({ getParentRoute: () => rootRoute, path: "/collection/$category/$product", component: Product });
const storyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/our-story", component: Story });
const storesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/stores", component: Stores });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: "/contact", component: Contact });
const privacyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/privacy", component: Privacy });
const accessibilityRoute = createRoute({ getParentRoute: () => rootRoute, path: "/accessibility", component: Accessibility });

// Admin – loaded only when someone opens /admin
const adminModule = () => import("./admin/routes").then((m) => m.adminPages);
const lazyPage = (key: keyof Awaited<ReturnType<typeof adminModule>>) => {
  const C = lazy(() => adminModule().then((p) => ({ default: p[key] as ComponentType })));
  return () => (
    <Suspense fallback={null}>
      <C />
    </Suspense>
  );
};
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin", component: lazyPage("AdminApp") });
const adminOverviewRoute = createRoute({ getParentRoute: () => adminRoute, path: "/", component: lazyPage("Overview") });
const adminHomeAdminRoute = createRoute({ getParentRoute: () => adminRoute, path: "/home", component: lazyPage("HomeAdmin") });
const adminCategoriesAdminRoute = createRoute({ getParentRoute: () => adminRoute, path: "/categories", component: lazyPage("CategoriesAdmin") });
const adminProductsAdminRoute = createRoute({ getParentRoute: () => adminRoute, path: "/products", component: lazyPage("ProductsAdmin") });
const adminProductEditRoute = createRoute({ getParentRoute: () => adminRoute, path: "/products/$cat/$slug", component: lazyPage("ProductEdit") });
const adminStoresAdminRoute = createRoute({ getParentRoute: () => adminRoute, path: "/stores", component: lazyPage("StoresAdmin") });
const adminStoryAdminRoute = createRoute({ getParentRoute: () => adminRoute, path: "/story", component: lazyPage("StoryAdmin") });
const adminSettingsAdminRoute = createRoute({ getParentRoute: () => adminRoute, path: "/settings", component: lazyPage("SettingsAdmin") });
const adminUsersAdminRoute = createRoute({ getParentRoute: () => adminRoute, path: "/users", component: lazyPage("UsersAdmin") });
const adminTree = adminRoute.addChildren([adminOverviewRoute, adminHomeAdminRoute, adminCategoriesAdminRoute, adminProductsAdminRoute, adminProductEditRoute, adminStoresAdminRoute, adminStoryAdminRoute, adminSettingsAdminRoute, adminUsersAdminRoute]);

const routeTree = rootRoute.addChildren([adminTree, homeRoute, categoryRoute, productRoute, storyRoute, storesRoute, contactRoute, privacyRoute, accessibilityRoute]);

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
