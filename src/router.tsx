import { createRootRoute, createRoute, createRouter, Outlet, ScrollRestoration } from "@tanstack/react-router";
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

const rootRoute = createRootRoute({
  component: () => (
    <>
      <ScrollRestoration />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  ),
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

const routeTree = rootRoute.addChildren([homeRoute, categoryRoute, productRoute, storyRoute, storesRoute, contactRoute, privacyRoute, accessibilityRoute]);

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
