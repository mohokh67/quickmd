import React from 'react';
import { useStore, ViewMode } from '../store';
import { version } from '../../package.json';

const buttonStyle: React.CSSProperties = {
  padding: '0.25rem 0.75rem',
  background: '#eee',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export function Toolbar() {
  const {
    viewMode,
    setViewMode,
    theme,
    setTheme,
    currentFilePath,
    isDirty,
    openFile,
    saveFile,
    saveFileAs,
    toggleSidebar,
    sidebarVisible,
  } = useStore();

  const modes: ViewMode[] = ['editor', 'split', 'preview'];

  const fileName = currentFilePath ? currentFilePath.split('/').pop() : 'Untitled';

  const handleOpen = async () => {
    const path = await window.api.openFileDialog();
    if (path) await openFile(path);
  };

  const handleSave = async () => {
    if (currentFilePath) {
      await saveFile();
    } else {
      await handleSaveAs();
    }
  };

  const handleSaveAs = async () => {
    const path = await window.api.saveFileDialog(currentFilePath ?? undefined);
    if (path) await saveFileAs(path);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid var(--border)',
        gap: '1rem',
      }}
    >
      <button
        onClick={toggleSidebar}
        style={{
          ...buttonStyle,
          background: sidebarVisible ? '#007acc' : '#eee',
          color: sidebarVisible ? '#fff' : '#000',
        }}
      >
        Files
      </button>

      <span style={{ fontWeight: 'bold' }}>QuickMD <span style={{ fontWeight: 'normal', fontSize: '0.75rem', color: '#888' }}>v{version}</span></span>
      <span style={{ color: '#666' }}>
        {fileName}
        {isDirty ? ' *' : ''}
      </span>

      <button onClick={handleOpen} style={buttonStyle}>
        Open
      </button>
      <button onClick={handleSave} style={buttonStyle}>
        Save
      </button>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              ...buttonStyle,
              background: viewMode === mode ? '#007acc' : '#eee',
              color: viewMode === mode ? '#fff' : '#000',
            }}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}

        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={buttonStyle}>
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </div>
  );
}
