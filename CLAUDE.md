# QuickMD - Claude Instructions

Cross-platform markdown editor with real-time preview built with Electron + React + CodeMirror 6.

## Project Structure

```
quickmd/
├── electron/
│   ├── main/
│   │   └── index.ts        # Main process: BrowserWindow, IPC handlers, file I/O
│   └── preload/
│       └── index.ts        # contextBridge: exposes window.api to renderer
├── src/                    # React frontend (renderer process)
│   ├── components/         # UI components
│   │   ├── Editor.tsx      # CodeMirror 6 wrapper
│   │   ├── Preview.tsx     # Markdown preview (marked.js)
│   │   ├── EditorContainer.tsx  # Split view container
│   │   ├── Toolbar.tsx     # Top toolbar
│   │   ├── Sidebar.tsx     # File browser
│   │   └── Divider.tsx     # Resizable split divider
│   ├── store/              # Zustand state management
│   │   └── useStore.ts     # App state + file operations
│   ├── hooks/              # React hooks
│   │   └── useKeyboardShortcuts.ts
│   ├── native.ts           # TS bindings for Electron IPC (window.api.*)
│   ├── global.d.ts         # Window.api type declaration
│   ├── App.tsx             # Root component
│   └── App.css             # Global styles + themes
├── electron.vite.config.ts # Three-entry build config (main, preload, renderer)
├── Justfile                # Task runner (just dev, just build, just package, etc.)
└── package.json            # Node dependencies
```

## Tech Stack

- **Frontend:** React 18, TypeScript, electron-vite
- **Editor:** CodeMirror 6 with markdown support
- **State:** Zustand
- **Markdown:** marked.js (frontend parsing for real-time)
- **Backend:** Electron (Node.js main process)
- **Persistence:** electron-store (userData directory)
- **Packaging:** electron-builder

## Key Patterns

### IPC Bridge
All native operations go through a secure IPC bridge:
- Main process handlers in `electron/main/index.ts` via `ipcMain.handle()`
- Exposed to renderer via `contextBridge.exposeInMainWorld('api', ...)` in `electron/preload/index.ts`
- Called in renderer via `window.api.*` (typed in `src/global.d.ts`)
- TS bindings in `src/native.ts` wrap `window.api.*` calls

### IPC Channels
| Channel | Description |
|---------|-------------|
| `read-file` | Read file contents as UTF-8 string |
| `write-file` | Write string content to file |
| `list-directory` | List dir entries sorted dirs-first, alpha |
| `get-home-dir` | Return OS home directory |
| `open-file-dialog` | Native file picker (`.md`, `.markdown`) |
| `save-file-dialog` | Native save dialog with optional defaultPath |
| `open-folder-dialog` | Native folder picker |
| `store-get` | Read value from electron-store by dot-notation key |
| `store-set` | Write value to electron-store by dot-notation key |

### Persistence (electron-store)
Store schema (namespaced):
- `workspace.lastFolder` — last opened folder path or `null`
- `ui.theme` — `'light'` or `'dark'`

Stored in OS userData: `~/Library/Application Support/quickmd` (macOS), `~/.config/quickmd` (Linux), `%APPDATA%\quickmd` (Windows).

### State Management
All app state in `src/store/useStore.ts`. Access via `useStore()` hook.
Store actions: `openFile()`, `saveFile()`, `saveFileAs()`

### View Modes
Three modes: `editor`, `preview`, `split`. Controlled by `viewMode` state.

### Theming
CSS variables in `.app.light` and `.app.dark` classes. Toggle via `setTheme()`. Theme persisted via `store-set('ui.theme', ...)`.

## Commands

```bash
# via npm
npm install          # Install dependencies
npm run dev          # Start Electron app with hot-reload
npm run build        # Build main + preload + renderer
npm run package      # Build + package into platform installers
npm run lint         # ESLint
npm run format:check # Prettier check

# via just (Justfile)
just dev             # Same as npm run dev
just build           # Same as npm run build
just package         # Same as npm run package
just lint            # ESLint
just format          # Prettier write
```

## Adding Features

### New IPC Handler
1. Add `ipcMain.handle('channel-name', ...)` in `electron/main/index.ts`
2. Expose via `contextBridge` in `electron/preload/index.ts`
3. Add typed wrapper in `src/native.ts`
4. Update `ElectronAPI` interface in `src/global.d.ts`

### New Component
1. Create in `src/components/`
2. Export from `src/components/index.ts`

### New State
Add to `AppState` interface and initial state in `src/store/useStore.ts`

## Keyboard Shortcuts

| Action | Key |
|--------|-----|
| Save | Cmd/Ctrl+S |
| Open | Cmd/Ctrl+O |
| Toggle sidebar | Cmd/Ctrl+B |
| Toggle preview | Cmd/Ctrl+P |
| Split view | Cmd/Ctrl+\ |
| Toggle theme | Cmd/Ctrl+Shift+T |

## Known Issues

- `author` and `description` missing from `package.json` — electron-builder warns but builds fine
- App ships unsigned — macOS shows Gatekeeper warning; users must right-click → Open

## Future Work (Deferred)

- HTML/PDF export
- Find/Replace
- Synced scrolling
- Autosave/crash recovery
- Code signing (Apple Developer + Authenticode)
- Session persistence (last-opened file)
