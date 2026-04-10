import { useState, useEffect } from 'react';
import { listDirectory, getHomeDir, FileEntry } from '../tauri';
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
    try {
      const files = await listDirectory(path);
      setRootPath(path);
      setEntries(files);
    } catch (e) {
      console.error('Failed to load directory:', e);
    }
  };

  useEffect(() => {
    getHomeDir().then(loadDirectory).catch(console.error);
  }, []);

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
      }}
    >
      <div
        style={{ padding: '0.5rem', fontWeight: 'bold', borderBottom: '1px solid var(--border)' }}
      >
        {rootPath?.split('/').pop() || 'Files'}
      </div>
      {entries.map((entry) => renderEntry(entry))}
    </div>
  );
}
