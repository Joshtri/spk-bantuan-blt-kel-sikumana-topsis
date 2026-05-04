import type { ReactNode } from "react";
import { useLogout, useMenu, useCan } from "@refinedev/core";
import { NavLink } from "react-router";
import { Button, cn, Tooltip } from "@heroui/react";
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftStartOnRectangleIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useSidebar } from "@/contexts/SidebarContext";
import { Text } from "../text";

function ResourceIcon({ icon }: { icon?: ReactNode }) {
  if (!icon) return <AdjustmentsHorizontalIcon className="h-5 w-5 shrink-0" />;
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
      {icon}
    </span>
  );
}

interface MenuItemWrapperProps {
  item: ReturnType<typeof useMenu>["menuItems"][number];
  isCollapsed: boolean;
  closeSidebar: () => void;
}

function MenuItemWrapper({ item, isCollapsed, closeSidebar }: MenuItemWrapperProps) {
  const { data } = useCan({
    resource: item.name,
    action: "list",
  });

  const hasAccess = data?.can ?? false;
  const label = item.label ?? item.name;

  console.log(`[Sidebar] Filtering ${item.name}: ${hasAccess ? "✓ visible" : "✗ hidden"}`);

  if (!hasAccess) return null;

  const navLink = (
    <NavLink
      to={item.route ?? "/"}
      end={item.route === "/"}
      onClick={() => closeSidebar()}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
          isCollapsed ? "justify-center px-0 w-10 mx-auto" : "",
          isActive
            ? "bg-white/15 text-white"
            : "text-slate-400 hover:bg-white/8 hover:text-slate-100",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !isCollapsed && (
            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-indigo-400" />
          )}
          <ResourceIcon icon={item.meta?.icon} />
          {!isCollapsed && (
            <span className="truncate leading-none">{label}</span>
          )}
        </>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <li key={item.key}>
        <Tooltip>
          <Tooltip.Trigger className="block w-full">
            {navLink}
          </Tooltip.Trigger>
          <Tooltip.Content placement="right">{label}</Tooltip.Content>
        </Tooltip>
      </li>
    );
  }

  return <li key={item.key}>{navLink}</li>;
}

export function Sidebar() {
  const { menuItems } = useMenu();
  const { mutate: logout } = useLogout();
  const { isOpen, isCollapsed, closeSidebar } = useSidebar();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={closeSidebar}
        aria-hidden
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col bg-slate-900",
          "transition-[width,transform] duration-200 ease-in-out",
          "lg:translate-x-0",
          isCollapsed ? "lg:w-17" : "lg:w-60",
          "w-60",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex h-14 shrink-0 items-center gap-2.5 border-b border-white/6 px-4",
            isCollapsed ? "justify-center px-2" : "justify-between",
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500 shadow-md shadow-indigo-500/30">
              <Squares2X2Icon className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <Text
                size="sm"
                weight="bold"
                className="tracking-tight text-white leading-tight"
              >
                SPK Bantuan
              </Text>
            )}
          </div>

          {/* Mobile close only — desktop toggle is in Header */}
          {!isCollapsed && (
            <button
              onClick={closeSidebar}
              className="flex lg:hidden h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-white/8 hover:text-slate-300 transition-colors"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {menuItems.map((item) => (
              <MenuItemWrapper
                key={item.key}
                item={item}
                isCollapsed={isCollapsed}
                closeSidebar={closeSidebar}
              />
            ))}
          </ul>
        </nav>

        {/* Sign out */}
        <div className="shrink-0 border-t border-white/6 px-3 py-3">
          {isCollapsed ? (
            <Tooltip>
              <Tooltip.Trigger className="block w-full">
                <button
                  onClick={() => logout()}
                  className="flex w-full items-center justify-center rounded-lg px-0 py-2.5 text-sm font-medium text-slate-500 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Sign out"
                >
                  <ArrowLeftStartOnRectangleIcon className="h-5 w-5 shrink-0" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content placement="right">Sign out</Tooltip.Content>
            </Tooltip>
          ) : (
            <Button
              variant="danger"
              onClick={() => logout()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
            >
              <ArrowLeftStartOnRectangleIcon className="h-5 w-5 shrink-0" />
              <span>Sign out</span>
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
