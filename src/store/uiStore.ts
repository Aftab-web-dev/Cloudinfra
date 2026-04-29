import { create } from 'zustand';
import type { CloudProvider } from '../types';

interface UIState {
  sidebarOpen: boolean;
  propertiesOpen: boolean;
  insightsOpen: boolean;
  activeProvider: CloudProvider;
  searchQuery: string;
  theme: 'light' | 'dark';
  showMinimap: boolean;
  snapToGrid: boolean;
  gridSize: number;
  activeTab: 'components' | 'templates' | 'layers' | 'text';

  toggleSidebar: () => void;
  toggleProperties: () => void;
  toggleInsights: () => void;
  setActiveProvider: (provider: CloudProvider) => void;
  setSearchQuery: (query: string) => void;
  toggleTheme: () => void;
  toggleMinimap: () => void;
  toggleSnapToGrid: () => void;
  setActiveTab: (tab: 'components' | 'templates' | 'layers' | 'text') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  propertiesOpen: true,
  insightsOpen: true,
  activeProvider: 'aws',
  searchQuery: '',
  theme: (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'dark'
    : 'light',
  showMinimap: true,
  snapToGrid: true,
  gridSize: 20,
  activeTab: 'components',

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleProperties: () => set((s) => ({ propertiesOpen: !s.propertiesOpen })),
  toggleInsights: () => set((s) => ({ insightsOpen: !s.insightsOpen })),
  setActiveProvider: (provider) => set({ activeProvider: provider }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      return { theme: next };
    }),
  toggleMinimap: () => set((s) => ({ showMinimap: !s.showMinimap })),
  toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
