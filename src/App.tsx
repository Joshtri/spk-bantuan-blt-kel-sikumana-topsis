import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { RouterProvider } from "@heroui/react";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, useNavigate } from "react-router";
import "./App.css";

import { PropsWithChildren } from "react";
import { RESOURCES } from "./constants/resources.tsx";
import { authProvider } from "./providers/auth-provider";
import { dataProvider } from "./providers/data-provider";
import { notificationProvider } from "./providers/notification/notification-provider";
import { NotificationProvider } from "./providers/notification";
import { LookupOptionsProvider } from "./contexts/lookupOptions";
import AppRoutes from "./app/routes/app-routes";

/** Bridges HeroUI's React Aria href-based navigation with react-router. */
function HeroUIRouterProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={(path) => navigate(path)}>
      {children}
    </RouterProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <LookupOptionsProvider>
      <HeroUIRouterProvider>
        <RefineKbarProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              routerProvider={routerProvider}
              authProvider={authProvider}
              notificationProvider={notificationProvider}
              resources={RESOURCES}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "dtjtOq-1KJViO-MlTCdt",
              }}
            >
              <AppRoutes />
              <NotificationProvider />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </RefineKbarProvider>
      </HeroUIRouterProvider>
      </LookupOptionsProvider>
    </BrowserRouter>
  );
}

export default App;
