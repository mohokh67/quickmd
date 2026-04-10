import { useState, useEffect } from 'react';
import { listDirectory, openFolderDialog, storeGet, storeSet, FileEntry } from '../native';
import { useStore } from '../store';

interface FolderState {
  [path: string]: boolean;
}

export function Sidebar() {
  const [rootPath, setRootPath] = useState<string | null>(null);
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [expanded, setExpanded] = useState<FolderState>({});
  const [subEntries, setSubEntries] = useState<{ [path: string]: FileEntry[] }>({});
  const { openFile, currentFilePath, sidebarVisible } = useStore();

  const loadDirectory = async (path: string) => {
    const files = await listDirectory(path);
    setRootPath(path);
    setEntries(files);
  };

  useEffect(() => {
    storeGet('workspace.lastFolder')
      .then(async (stored) => {
        const folder = stored as string | null;
        if (!folder) return;
        try {
          await loadDirectory(folder);
        } catch {
          // path no longer exists — clear stored value and show empty state
          await storeSet('workspace.lastFolder', null);
        }
      })
      .catch(console.error);
  }, []);

  const handleOpenFolder = async () => {
    const path = await openFolderDialog();
    if (!path) return;
    try {
      await loadDirectory(path);
      await storeSet('workspace.lastFolder', path);
    } catch (e) {
      console.error('Failed to load folder:', e);
    }
  };

  const toggleFolder = async (path: string) => {
    if (expanded[path]) {
      setExpanded((prev) => ({ ...prev, [path]: false }));
    } else {
      if (!subEntries[path]) {
        const files = await listDirectory(path);
        setSubEntries((prev) => ({ ...prev, [path]: files }));
      }
      setExpanded((prev) => ({ ...prev, [path]: true }));
    }
  };

  const handleFileClick = (entry: FileEntry) => {
    if (entry.is_dir) {
      toggleFolder(entry.path);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.markdown')) {
      openFile(entry.path);
    }
  };

  if (!sidebarVisible) return null;

  const renderEntry = (entry: FileEntry, depth: number = 0) => {
    const isActive = currentFilePath === entry.path;
    const isExpanded = expanded[entry.path];

    return (
      <div key={entry.path}>
        <div
          onClick={() => handleFileClick(entry)}
          style={{
            padding: '0.25rem 0.5rem',
            paddingLeft: `${depth * 1 + 0.5}rem`,
            cursor: 'pointer',
            background: isActive ? '#007acc' : 'transparent',
            color: isActive ? '#fff' : 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <span>{entry.is_dir ? (isExpanded ? 'v' : '>') : ' '}</span>
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {entry.name}
          </span>
        </div>
        {entry.is_dir &&
          isExpanded &&
          subEntries[entry.path]?.map((sub) => renderEntry(sub, depth + 1))}
      </div>
    );
  };

  return (
    <div
      style={{
        width: '200px',
        borderRight: '1px solid var(--border)',
        overflow: 'auto',
        fontSize: '0.875rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '0.5rem',
          fontWeight: 'bold',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.25rem',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {rootPath ? rootPath.split('/').pop() : 'No Folder'}
        </span>
        <button
          onClick={handleOpenFolder}
          title="Open Folder"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            padding: '0.1rem 0.25rem',
            flexShrink: 0,
            fontSize: '1rem',
          }}
        >
          📂
        </button>
      </div>

      {!rootPath ? (
        <div
          style={{
            padding: '1rem 0.5rem',
            color: 'var(--text-muted, #888)',
            textAlign: 'center',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>No folder open</div>
          <button
            onClick={handleOpenFolder}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'inherit',
              padding: '0.25rem 0.5rem',
              fontSize: '0.8rem',
            }}
          >
            Open Folder
          </button>
        </div>
      ) : (
        entries.map((entry) => renderEntry(entry))
      )}
    </div>
  );
}
