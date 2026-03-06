import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { STORAGE_KEYS, getItem } from "./lib/storage";

// Pages
import { AgeGate } from "./pages/AgeGate";
import { GiveawayPage } from "./pages/GiveawayPage";
import { PaymentPage } from "./pages/PaymentPage";
import { ProfilePage } from "./pages/ProfilePage";
import { TournamentDetailPage } from "./pages/TournamentDetailPage";
import { TournamentsPage } from "./pages/TournamentsPage";
import { WalletPage } from "./pages/WalletPage";
import { WithdrawalPage } from "./pages/WithdrawalPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { PrivacyPage } from "./pages/legal/PrivacyPage";
import { TermsPage } from "./pages/legal/TermsPage";

// ==========================================
// ROUTE GUARDS
// ==========================================

function requireAgeConfirmed(): void {
  const ageConfirmed = getItem<boolean>(STORAGE_KEYS.AGE_CONFIRMED);
  if (!ageConfirmed) {
    throw redirect({ to: "/" });
  }
}

function requireAuth(): void {
  requireAgeConfirmed();
  const session = getItem(STORAGE_KEYS.SESSION);
  if (!session) {
    throw redirect({ to: "/auth/login" });
  }
}

function requireAdmin(): void {
  requireAgeConfirmed();
  const session = getItem<{ role?: string }>(STORAGE_KEYS.SESSION);
  if (!session) {
    throw redirect({ to: "/admin/login" });
  }
  if ((session as { role?: string }).role !== "admin") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw redirect({ to: "/tournaments", search: { tab: undefined } as any });
  }
}

// ==========================================
// ROOT LAYOUT
// ==========================================

function RootLayout() {
  return (
    <DataProvider>
      <AuthProvider>
        <Outlet />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(13,13,26,0.98)",
              border: "1px solid rgba(0,245,255,0.2)",
              color: "#e2e8f0",
            },
          }}
        />
      </AuthProvider>
    </DataProvider>
  );
}

// ==========================================
// ROUTES
// ==========================================

const rootRoute = createRootRoute({ component: RootLayout });

// Age Gate
const ageGateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const ageConfirmed = getItem<boolean>(STORAGE_KEYS.AGE_CONFIRMED);
    if (ageConfirmed) {
      const session = getItem(STORAGE_KEYS.SESSION);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (session)
        throw redirect({
          to: "/tournaments",
          search: { tab: undefined } as any,
        });
      throw redirect({ to: "/auth/login" });
    }
  },
  component: AgeGate,
});

// Auth routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/login",
  beforeLoad: () => {
    const ageConfirmed = getItem<boolean>(STORAGE_KEYS.AGE_CONFIRMED);
    if (!ageConfirmed) throw redirect({ to: "/" });
    const session = getItem(STORAGE_KEYS.SESSION);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (session)
      throw redirect({ to: "/tournaments", search: { tab: undefined } as any });
  },
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/register",
  beforeLoad: () => {
    const ageConfirmed = getItem<boolean>(STORAGE_KEYS.AGE_CONFIRMED);
    if (!ageConfirmed) throw redirect({ to: "/" });
  },
  component: RegisterPage,
});

// Protected routes
const tournamentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tournaments",
  beforeLoad: requireAuth,
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  component: TournamentsPage,
});

const tournamentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tournaments/$id",
  beforeLoad: requireAuth,
  component: TournamentDetailPage,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  beforeLoad: requireAuth,
  component: WalletPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment",
  beforeLoad: requireAuth,
  component: PaymentPage,
});

const withdrawalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/withdrawal",
  beforeLoad: requireAuth,
  component: WithdrawalPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  beforeLoad: requireAuth,
  component: ProfilePage,
});

const giveawayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/giveaway",
  beforeLoad: requireAuth,
  component: GiveawayPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  beforeLoad: () => {
    requireAgeConfirmed();
    const session = getItem<{ role?: string }>(STORAGE_KEYS.SESSION);
    if (session && (session as { role?: string }).role === "admin") {
      throw redirect({ to: "/admin" });
    }
  },
  component: AdminLoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: requireAdmin,
  component: AdminDashboard,
});

// Legal routes (no auth required)
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal/terms",
  component: TermsPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal/privacy",
  component: PrivacyPage,
});

// ==========================================
// ROUTER
// ==========================================

const routeTree = rootRoute.addChildren([
  ageGateRoute,
  loginRoute,
  registerRoute,
  tournamentsRoute,
  tournamentDetailRoute,
  walletRoute,
  paymentRoute,
  withdrawalRoute,
  profileRoute,
  giveawayRoute,
  adminLoginRoute,
  adminRoute,
  termsRoute,
  privacyRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
