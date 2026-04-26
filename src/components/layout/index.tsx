import type { PropsWithChildren } from "react";
import { cn } from "@heroui/react";

import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { Breadcrumb } from "@/components/breadcrumb";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

function LayoutInner({ children }: PropsWithChildren) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-default-50">
      <Sidebar />

      {/* Main area — offset by sidebar width on desktop */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-[margin-left] duration-200 ease-in-out",
          "ml-0 lg:ml-60",
          isCollapsed && "lg:ml-16",
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
};
