import { useGetIdentity, useLogout } from "@refinedev/core";
import { Avatar, Button, Dropdown } from "@heroui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  BellIcon,
  Bars4Icon,
} from "@heroicons/react/24/outline";

import { useSidebar } from "@/contexts/SidebarContext";

interface Identity {
  name?: string;
  email?: string;
  avatar?: string;
}

function getInitials(name?: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Header() {
  const { toggleSidebar, toggleCollapsed } = useSidebar();
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity<Identity>();

  return (
    <header
      className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-default-100/80 bg-white/80 px-4 backdrop-blur-md"
      style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.04), 0 2px 8px 0 rgba(0,0,0,0.03)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile: open/close drawer */}
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          className="lg:hidden shrink-0 text-default-500"
          onPress={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Bars4Icon className="h-5 w-5" />
        </Button>
        {/* Desktop: collapse/expand rail */}
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          className="hidden lg:flex shrink-0 text-default-500"
          onPress={toggleCollapsed}
          aria-label="Toggle sidebar"
        >
          <Bars4Icon className="h-5 w-5" />
        </Button>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-1.5">
        {/* Notification bell */}
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          className="text-default-500 hover:text-default-800"
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5" />
        </Button>

        {/* User dropdown */}
        <Dropdown>
          <Dropdown.Trigger>
            <button
              className="flex items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-default-100 focus:outline-none"
              aria-label="User menu"
            >
              <Avatar size="sm" className="ring-2 ring-primary/20">
                {identity?.avatar ? (
                  <Avatar.Image src={identity.avatar} alt={identity.name} />
                ) : null}
                <Avatar.Fallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {getInitials(identity?.name)}
                </Avatar.Fallback>
              </Avatar>
              <span className="hidden sm:block max-w-28 truncate text-sm font-medium text-default-700">
                {identity?.name ?? "User"}
              </span>
            </button>
          </Dropdown.Trigger>

          <Dropdown.Popover>
            <Dropdown.Menu aria-label="User actions">
              <Dropdown.Item id="user-info" className="pointer-events-none opacity-100">
                <div className="flex flex-col gap-0.5 py-0.5">
                  <span className="text-sm font-semibold text-default-800">
                    {identity?.name ?? "User"}
                  </span>
                  <span className="text-xs text-default-400">{identity?.email ?? ""}</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                id="logout"
                variant="danger"
                onPress={() => logout()}
              >
                <span className="flex items-center gap-2">
                  <ArrowLeftStartOnRectangleIcon className="h-4 w-4" />
                  Sign out
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </header>
  );
}
