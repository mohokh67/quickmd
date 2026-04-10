import { useEffect } from 'react';
import { useStore } from '../store';

export function useKeyboardShortcuts() {
  const {
    openFile,
    saveFile,
    saveFileAs,
    currentFilePath,
    toggleSidebar,
    setViewMode,
    setTheme,
    theme,
    viewMode,
  } = useStore();

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && e.key === 's') {
        e.preventDefault();
        if (currentFilePath) {
          await saveFile();
        } else {
          const path = await window.api.saveFileDialog();
          if (path) await saveFileAs(path);
        }
      }

      if (isMod && e.key === 'o') {
        e.preventDefault();
        const path = await window.api.openFileDialog();
        if (path) await openFile(path);
      }

      if (isMod && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }

      if (isMod && e.key === 'p') {
        e.preventDefault();
        setViewMode(viewMode === 'preview' ? 'split' : 'preview');
      }

      if (isMod && e.key === '\\') {
        e.preventDefault();
        setViewMode('split');
      }

      if (isMod && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setTheme(theme === 'light' ? 'dark' : 'light');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    openFile,
    saveFile,
    saveFileAs,
    currentFilePath,
    toggleSidebar,
    setViewMode,
    setTheme,
    theme,
    viewMode,
  ]);
}
