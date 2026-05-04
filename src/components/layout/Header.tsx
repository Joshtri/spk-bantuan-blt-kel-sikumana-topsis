import { useGetIdentity, useGo, useLogout } from "@refinedev/core";
import { Avatar, Button, Dropdown } from "@heroui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  BellIcon,
  Bars4Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import { useSidebar } from "@/contexts/SidebarContext";
import { IAuthIdentity } from "@/interfaces/Authorize";

// interface Identity {
//   name?: string;
//   email?: string;
//   avatar?: string;
//   username?: string;
// }

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
  const { data: identity } = useGetIdentity<IAuthIdentity>();

  const go = useGo();

  return (
    <header
      className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-default-100/80 bg-white/80 px-4 backdrop-blur-md"
      style={{
        boxShadow: "0 1px 0 0 rgba(0,0,0,0.04), 0 2px 8px 0 rgba(0,0,0,0.03)",
      }}
    >
      {/* Left: toggle + branding */}
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

        {/* Branding */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
            <svg fill="none" height="14" viewBox="0 0 24 24" width="14">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <div className="hidden sm:flex flex-col leading-tight min-w-0">
            <span className="text-sm font-semibold text-default-800 truncate">
              SPK Penerima Bantuan
            </span>
            <span className="text-xs text-default-400 truncate">
              Kelurahan Sikumana
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-1.5">
        {/* User dropdown */}
        <Dropdown>
          <Dropdown.Trigger>
            <div
              className="flex items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-default-100 focus:outline-none cursor-pointer"
              aria-label="User menu"
            >
              <Avatar size="sm" className="ring-2 ring-primary/20">
                <Avatar.Image alt={identity?.username} />

                <Avatar.Fallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {getInitials(identity?.username)}
                </Avatar.Fallback>
              </Avatar>
              <span className="hidden sm:block max-w-28 truncate text-sm font-medium text-default-700">
                {identity?.username ?? "User"}
              </span>
            </div>
          </Dropdown.Trigger>

          <Dropdown.Popover>
            <Dropdown.Menu aria-label="User actions">
              <Dropdown.Item
                id={"profile"}
                onPress={() => go({ to: "/my-profile" })}
              >
                <span className="flex items-center gap-2">
                  <UserCircleIcon className="h-4 w-4" />
                  My Profile
                </span>
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
