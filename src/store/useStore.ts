import { create } from 'zustand';
import { readFile, writeFile, storeSet } from '../native';

export type ViewMode = 'editor' | 'preview' | 'split';
export type Theme = 'light' | 'dark';

interface AppState {
  // File state
  currentFilePath: string | null;
  content: string;
  isDirty: boolean;

  // UI state
  viewMode: ViewMode;
  theme: Theme;
  sidebarVisible: boolean;
  splitRatio: number;

  // Actions
  setContent: (content: string) => void;
  setCurrentFile: (path: string | null, content: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSplitRatio: (ratio: number) => void;
  markClean: () => void;

  // File operations
  openFile: (path: string) => Promise<void>;
  saveFile: () => Promise<void>;
  saveFileAs: (path: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  currentFilePath: null,
  content: '# Welcome to QuickMD\n\nStart typing...',
  isDirty: false,
  viewMode: 'split',
  theme: 'light',
  sidebarVisible: true,
  splitRatio: 0.5,

  setContent: (content) => set({ content, isDirty: true }),
  setCurrentFile: (path, content) => set({ currentFilePath: path, content, isDirty: false }),
  setViewMode: (viewMode) => set({ viewMode }),
  setTheme: (theme) => {
    set({ theme });
    storeSet('ui.theme', theme).catch(console.error);
  },
  toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),
  setSplitRatio: (splitRatio) => set({ splitRatio }),
  markClean: () => set({ isDirty: false }),

  openFile: async (path) => {
    const content = await readFile(path);
    set({ currentFilePath: path, content, isDirty: false });
  },

  saveFile: async () => {
    const { currentFilePath, content } = get();
    if (currentFilePath) {
      await writeFile(currentFilePath, content);
      set({ isDirty: false });
    }
  },

  saveFileAs: async (path) => {
    const { content } = get();
    await writeFile(path, content);
    set({ currentFilePath: path, isDirty: false });
  },
}));
