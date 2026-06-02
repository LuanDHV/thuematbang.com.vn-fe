import { create } from "zustand";

// Define the state and actions interface for the store
type UserUIState = {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
};

// Create a global custom hook store using Zustand to manage user UI states
export const useUserUIStore = create<UserUIState>((set) => ({
  // Initial state: sidebar is expanded by default
  isSidebarCollapsed: false,

  // Action to toggle the sidebar collapse state between true and false
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  // Action to force set the sidebar collapse state to a specific boolean value
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
}));
