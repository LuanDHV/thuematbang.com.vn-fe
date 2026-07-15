import { create } from "zustand";

type UIState = {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  isCmsSidebarCollapsed: boolean;
  setCmsSidebarCollapsed: (collapsed: boolean) => void;
  toggleCmsSidebarCollapsed: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  isCmsSidebarCollapsed: true,
  setCmsSidebarCollapsed: (collapsed) =>
    set({ isCmsSidebarCollapsed: collapsed }),
  toggleCmsSidebarCollapsed: () =>
    set((state) => ({
      isCmsSidebarCollapsed: !state.isCmsSidebarCollapsed,
    })),
}));
