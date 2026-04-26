import {
  createContext,
  useContext,
  useState,
  useCallback,
  type PropsWithChildren,
} from "react";

interface SidebarContextValue {
  isOpen: boolean;
  isCollapsed: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);
  const toggleSidebar = useCallback(() => setIsOpen((v) => !v), []);
  const toggleCollapsed = useCallback(() => setIsCollapsed((v) => !v), []);

  return (
    <SidebarContext.Provider
      value={{ isOpen, isCollapsed, openSidebar, closeSidebar, toggleSidebar, toggleCollapsed }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
