# QuickMD: Tauri → Electron Migration Design

**Date:** 2026-04-10
**Branch:** `feat/electron-migration`

## Goal

Replace the Rust/Tauri backend with a pure Node.js/Electron backend. Keep the React frontend (CodeMirror 6, Zustand, marked.js) intact. Result: cross-platform desktop app (macOS, Linux, Windows) buildable with only Node.js toolchain.

---

## Architecture

Three-process Electron model with contextIsolation enabled (secure by default):

```
┌─────────────────────────────────┐
│ Main Process (Node.js)          │
│ electron/main/index.ts          │
│ - BrowserWindow lifecycle       │
│ - ipcMain handlers (fs, dialog) │
└────────────┬────────────────────┘
             │ IPC (ipcMain / ipcRenderer)
┌────────────▼────────────────────┐
│ Preload Script                  │
│ electron/preload/index.ts       │
│ - contextBridge.exposeInMainWorld│
│ - exposes window.api            │
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
│   ├── components/
│   │   └── Toolbar.tsx         # CHANGE: dialogs via window.api
│   ├── store/useStore.ts       # CHANGE: import from native not tauri
│   └── ...rest untouched
├── docs/superpowers/specs/     # This file
├── electron.vite.config.ts     # REPLACES vite.config.ts
├── Justfile                    # NEW: task runner
├── package.json                # UPDATED: swap tauri deps for electron deps
└── index.html                  # UNTOUCHED
```

**Deleted:** `src-tauri/`, `src/tauri.ts`

---

## IPC Design

### Main process handlers (`electron/main/index.ts`)

| Channel | Handler | Node.js API |
|---|---|---|
| `read-file` | `(path) → string` | `fs.promises.readFile(path, 'utf-8')` |
| `write-file` | `(path, content)` | `fs.promises.writeFile(path, content, 'utf-8')` |
| `list-directory` | `(path) → FileEntry[]` | `fs.promises.readdir` + `stat`, sorted dirs-first |
| `get-home-dir` | `() → string` | `os.homedir()` |
| `dialog:open-file` | `() → string \| null` | `dialog.showOpenDialog` (.md, .markdown filter) |
| `dialog:save-file` | `() → string \| null` | `dialog.showSaveDialog` (.md filter) |

### Preload (`electron/preload/index.ts`)

```ts
contextBridge.exposeInMainWorld('api', {
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  writeFile: (path: string, content: string) => ipcRenderer.invoke('write-file', path, content),
  listDirectory: (path: string) => ipcRenderer.invoke('list-directory', path),
  getHomeDir: () => ipcRenderer.invoke('get-home-dir'),
  openFileDialog: () => ipcRenderer.invoke('dialog:open-file'),
  saveFileDialog: () => ipcRenderer.invoke('dialog:save-file'),
})
```

### Renderer (`src/native.ts`)

Same exported function signatures as current `src/tauri.ts`. Calls `window.api.*`. No other files change except `Toolbar.tsx` (dialogs) and `useStore.ts` (import path).

---

## Dependencies

### Remove
- `@tauri-apps/api`
- `@tauri-apps/plugin-dialog`
- `@tauri-apps/cli` (devDep)

### Add
- `electron` (devDep, latest stable)
- `electron-vite` (devDep)
- `electron-builder` (devDep, for packaging)

---

## Build Config

`electron.vite.config.ts` defines three Vite entry points:

- **main** → `electron/main/index.ts` (CommonJS output)
- **preload** → `electron/preload/index.ts` (CommonJS output)
- **renderer** → `src/` (ESM, same Vite/React config as today)

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

```just
# Dev
dev:
    npm run dev

# Build renderer + main + preload
build:
    npm run build

# Preview built app
preview:
    npm run preview

# Package into installers
package:
    npm run package

# Linting
lint:
    npm run lint

lint-fix:
    npm run lint-fix

# Formatting
format:
    npm run format

format-check:
    npm run format-check

# Install dependencies
install:
    npm ci
```

---

## What Does NOT Change

- `src/components/Editor.tsx` — CodeMirror 6 setup
- `src/components/Preview.tsx` — marked.js rendering
- `src/components/EditorContainer.tsx`, `Sidebar.tsx`, `Divider.tsx`
- `src/store/useStore.ts` — only the import path changes (`../native`)
- `src/hooks/useKeyboardShortcuts.ts`
- `src/App.tsx`, `src/App.css`
- `index.html`
- `tsconfig.json`, `.prettierrc`, `eslint.config.js`

---

## CI/CD (Secondary — Post-Local-Verification)

Existing `.github/workflows/release-please.yml` build job changes:
- Remove Rust toolchain setup step
- Remove Linux webkit/appindicator deps (no longer needed)
- Replace `npm run tauri build` with `just build && just package`
- Update artifact paths to electron-builder output dirs

---

## Local Dev Flow

```bash
git checkout -b feat/electron-migration
npm install        # or: just install
just dev           # Electron window opens with hot-reload
just build         # Production build
just package       # Build installers (secondary)
```

---

## Open Questions

None — scope is fully defined. CI/CD workflow update is explicitly deferred until local build is verified.
