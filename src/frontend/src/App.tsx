import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ModeProvider } from './context/ModeContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import WelcomePage from './pages/WelcomePage';
import OnboardingFlow from './pages/onboarding/OnboardingFlow';
import KidsDashboardPage from './pages/kids/KidsDashboardPage';
import AdultsDashboardPage from './pages/adults/AdultsDashboardPage';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import RewardsStorePage from './pages/store/RewardsStorePage';
import SettingsPage from './pages/settings/SettingsPage';
import { Loader2 } from 'lucide-react';

function RootLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ModeProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
        <Toaster />
      </ModeProvider>
    </ThemeProvider>
  );
}

function IndexPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  if (isInitializing || (identity && profileLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity) {
    return <WelcomePage />;
  }

  if (isFetched && userProfile === null) {
    return <OnboardingFlow />;
  }

  if (userProfile) {
    return <KidsDashboardPage />;
  }

  return null;
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingFlow,
});

const kidsDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kids',
  component: KidsDashboardPage,
});

const adultsDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/adults',
  component: AdultsDashboardPage,
});

const parentDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parent',
  component: ParentDashboardPage,
});

const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/store',
  component: RewardsStorePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  onboardingRoute,
  kidsDashboardRoute,
  adultsDashboardRoute,
  parentDashboardRoute,
  storeRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
