# QuickMD: Tauri → Electron Migration Design

**Date:** 2026-04-10
**Branch:** `feat/electron-migration`

## Goal

Replace the Rust/Tauri backend with a pure Node.js/Electron backend. Keep the React frontend (CodeMirror 6, Zustand, marked.js) intact. Result: cross-platform desktop app (macOS, Linux, Windows) buildable with only Node.js toolchain.

---

## Architecture

Three-process Electron model with `contextIsolation: true`, `nodeIntegration: false`:

```
┌─────────────────────────────────┐
│ Main Process (Node.js)          │
│ electron/main/index.ts          │
│ - BrowserWindow lifecycle       │
│ - ipcMain.handle() for all ops  │
└────────────┬────────────────────┘
             │ IPC channels (all hyphenated)
┌────────────▼────────────────────┐
│ Preload Script                  │
│ electron/preload/index.ts       │
│ - contextBridge.exposeInMainWorld│
│ - exposes typed window.api      │
└────────────┬────────────────────┘
             │ window.api.*
┌────────────▼────────────────────┐
│ Renderer (React)                │
│ src/ — mostly unchanged         │
│ src/native.ts replaces tauri.ts │
└─────────────────────────────────┘
```

---

## Project Structure

```
quickmd/
├── electron/
│   ├── main/
│   │   └── index.ts            # Main process
│   └── preload/
│       └── index.ts            # contextBridge → window.api
├── src/
│   ├── native.ts               # NEW: replaces tauri.ts, same interface
│   ├── global.d.ts             # NEW: window.api TypeScript declaration
│   ├── components/
│   │   └── Toolbar.tsx         # CHANGE: dialogs via window.api
│   ├── store/useStore.ts       # CHANGE: import from ./native
│   └── ...rest untouched
├── electron.vite.config.ts     # REPLACES vite.config.ts
├── tsconfig.electron.json      # NEW: Node.js types for electron/ source
├── Justfile                    # NEW: task runner
├── package.json                # UPDATED
└── index.html                  # UNTOUCHED
```

**Deleted:** `src-tauri/`, `src/tauri.ts`

---

## Types

### `FileEntry` (shared shape)

```ts
interface FileEntry {
  name: string;       // filename only (e.g. "notes.md")
  path: string;       // absolute path
  is_dir: boolean;    // underscore form — matches current Tauri struct, Sidebar.tsx uses this field
}
```

---

## IPC Design

### Channel naming convention

All channels use hyphen-only naming (no colons):

| Channel | Signature | Implementation |
|---|---|---|
| `read-file` | `(path: string) → string` | `fs.promises.readFile(path, 'utf-8')` |
| `write-file` | `(path: string, content: string) → void` | `fs.promises.writeFile(path, content, 'utf-8')` |
| `list-directory` | `(path: string) → FileEntry[]` | `fs.promises.readdir` + per-entry `stat`; skip entries where stat throws |
| `get-home-dir` | `() → string` | `os.homedir()` |
| `open-file-dialog` | `() → string \| null` | `dialog.showOpenDialog(win, ...)` |
| `save-file-dialog` | `(defaultPath?: string) → string \| null` | `dialog.showSaveDialog(win, { defaultPath, ... })` |

`save-file-dialog` accepts an optional `defaultPath` so the dialog pre-fills the suggested filename when saving a new file. `open-file-dialog` and `save-file-dialog` receive `win` as the first arg to `dialog.*` for proper modal attachment on macOS.

For `list-directory`: entries where `stat` throws (e.g. broken symlinks) are silently skipped — consistent with current Tauri behavior.

### Main process (`electron/main/index.ts`)

```ts
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

let win: BrowserWindow

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'QuickMD',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  // macOS: re-create window on dock icon click if none open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit on all windows closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC handlers
ipcMain.handle('read-file', (_e, path: string) =>
  fs.promises.readFile(path, 'utf-8'))

ipcMain.handle('write-file', (_e, filePath: string, content: string) =>
  fs.promises.writeFile(filePath, content, 'utf-8'))

ipcMain.handle('list-directory', async (_e, dirPath: string) => {
  const entries = await fs.promises.readdir(dirPath)
  const result: FileEntry[] = []
  for (const name of entries) {
    const fullPath = path.join(dirPath, name)
    try {
      const stat = await fs.promises.stat(fullPath)
      result.push({ name, path: fullPath, is_dir: stat.isDirectory() })
    } catch {
      // skip unreadable entries (broken symlinks, permission errors)
    }
  }
  return result.sort((a, b) => {
    if (a.is_dir !== b.is_dir) return a.is_dir ? -1 : 1
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  })
})

ipcMain.handle('get-home-dir', () => os.homedir())

ipcMain.handle('open-file-dialog', () =>
  dialog.showOpenDialog(win, {
    filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
    properties: ['openFile'],
  }).then(r => r.canceled ? null : r.filePaths[0]))

ipcMain.handle('save-file-dialog', (_e, defaultPath?: string) =>
  dialog.showSaveDialog(win, {
    defaultPath,
    filters: [{ name: 'Markdown', extensions: ['md'] }],
  }).then(r => r.canceled ? null : r.filePath))
```

### Preload (`electron/preload/index.ts`)

```ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  readFile: (path: string): Promise<string> =>
    ipcRenderer.invoke('read-file', path),

  writeFile: (path: string, content: string): Promise<void> =>
    ipcRenderer.invoke('write-file', path, content),

  listDirectory: (path: string): Promise<FileEntry[]> =>
    ipcRenderer.invoke('list-directory', path),

  getHomeDir: (): Promise<string> =>
    ipcRenderer.invoke('get-home-dir'),

  openFileDialog: (): Promise<string | null> =>
    ipcRenderer.invoke('open-file-dialog'),

  saveFileDialog: (defaultPath?: string): Promise<string | null> =>
    ipcRenderer.invoke('save-file-dialog', defaultPath),
})
```

### TypeScript global declaration (`src/global.d.ts`)

```ts
interface FileEntry {
  name: string
  path: string
  is_dir: boolean
}

interface ElectronAPI {
  readFile(path: string): Promise<string>
  writeFile(path: string, content: string): Promise<void>
  listDirectory(path: string): Promise<FileEntry[]>
  getHomeDir(): Promise<string>
  openFileDialog(): Promise<string | null>
  saveFileDialog(defaultPath?: string): Promise<string | null>
}

declare interface Window {
  api: ElectronAPI
}
```

### Renderer (`src/native.ts`)

Same exported function signatures as current `src/tauri.ts`, plus `FileEntry` re-export. Calls `window.api.*`.

`saveFileAs` flow: `useStore.ts`'s `saveFileAs(path)` action calls `window.api.writeFile(path, content)` directly (path already resolved by caller). `Toolbar.tsx` calls `window.api.saveFileDialog(currentFilePath ?? undefined)` to get the path first, then passes it to `saveFileAs`. No behavioral change from current Tauri flow.

---

## Build Config (`electron.vite.config.ts`)

```ts
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    entry: 'electron/main/index.ts',
    build: { outDir: 'dist-electron/main' },
  },
  preload: {
    input: 'electron/preload/index.ts',
    build: { outDir: 'dist-electron/preload' },
  },
  renderer: {
    plugins: [react()],
    build: { outDir: 'dist-electron/renderer' },
  },
})
```

---

## TypeScript Config for Electron Source (`tsconfig.electron.json`)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2020",
    "lib": ["ES2020"],
    "types": ["node", "electron"]
  },
  "include": ["electron/**/*"]
}
```

The base `tsconfig.json` (browser types, ESM) covers `src/`. `tsconfig.electron.json` covers `electron/` with Node.js types. electron-vite picks up both via its own config resolution.

---

## Dependencies

### Remove
- `@tauri-apps/api`
- `@tauri-apps/plugin-dialog`
- `@tauri-apps/cli` (devDep)

### Add
- `electron` (devDep, latest stable)
- `electron-vite` (devDep)
- `electron-builder` (devDep)

---

## package.json Scripts

```json
{
  "dev": "electron-vite dev",
  "build": "electron-vite build",
  "preview": "electron-vite preview",
  "package": "electron-vite build && electron-builder",
  "lint": "eslint src/",
  "lint:fix": "eslint src/ --fix",
  "format": "prettier --write src/",
  "format:check": "prettier --check src/"
}
```

---

## Justfile

Recipe names use hyphens (colons are invalid in `just` recipe names). Recipes call `npm run` with the colon-form script names from `package.json`.

```just
# Dev — opens Electron window with hot-reload
dev:
    npm run dev

# Build main + preload + renderer
build:
    npm run build

# Preview production build
preview:
    npm run preview

# Package into platform installers
package:
    npm run package

lint:
    npm run lint

lint-fix:
    npm run lint:fix

format:
    npm run format

format-check:
    npm run format:check

install:
    npm ci
```

---

## What Does NOT Change

- `src/components/Editor.tsx`, `Preview.tsx`, `EditorContainer.tsx`, `Sidebar.tsx`, `Divider.tsx`
- `src/store/useStore.ts` — import path changes from `../tauri` to `./native` only
- `src/hooks/useKeyboardShortcuts.ts`
- `src/App.tsx`, `src/App.css`
- `index.html`
- `.prettierrc`, `eslint.config.js`
- `tsconfig.json` (base, browser-scoped — unchanged)

---

## CI/CD (Secondary — Post-Local-Verification)

Existing `.github/workflows/release-please.yml` changes needed:
- Remove Rust toolchain setup step
- Remove Linux webkit/appindicator apt deps
- Replace `npm run tauri build` with `just build && just package`
- Update artifact paths to electron-builder output (`dist/`)
- `release-please-config.json` currently tracks `Cargo.toml` version — update to track `package.json`

---

## Local Dev Flow

```bash
git checkout -b feat/electron-migration
just install       # npm ci
just dev           # Electron window opens with hot-reload
just build         # Production build
just package       # Build installers (deferred, secondary)
```

---

## Open Questions

1. **electron-builder config** — `productName`, `appId`, output formats (dmg/AppImage/nsis) needed for `just package`. Defined at impl time; not required for `just dev` or `just build`.
2. **@types/electron** — electron-vite may bundle these; confirm at impl time whether explicit `@types/electron` devDep is needed.
