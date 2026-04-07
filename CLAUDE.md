# QuickMD - Claude Instructions

Cross-platform markdown editor with real-time preview built with Tauri + React + CodeMirror 6.

## Project Structure

```
quickmd/
├── src/                    # React frontend
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
│   ├── tauri.ts            # TS bindings for Rust commands
│   ├── App.tsx             # Root component
│   └── App.css             # Global styles + themes
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── lib.rs          # Tauri commands (file I/O)
│   │   └── main.rs         # Entry point
│   ├── capabilities/       # Tauri permissions
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri config
└── package.json            # Node dependencies
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Editor:** CodeMirror 6 with markdown support
- **State:** Zustand
- **Markdown:** marked.js (frontend parsing for real-time)
- **Backend:** Tauri 2.x (Rust)
- **File dialogs:** tauri-plugin-dialog

## Key Patterns

### State Management
All app state in `src/store/useStore.ts`. Access via `useStore()` hook.

### File Operations
- Rust commands in `src-tauri/src/lib.rs`: `read_file`, `write_file`, `list_directory`, `get_home_dir`
- TS bindings in `src/tauri.ts`
- Store actions: `openFile()`, `saveFile()`, `saveFileAs()`

### View Modes
Three modes: `editor`, `preview`, `split`. Controlled by `viewMode` state.

### Theming
CSS variables in `.app.light` and `.app.dark` classes. Toggle via `setTheme()`.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server only
npm run tauri dev    # Start full Tauri app (dev)
npm run build        # Build frontend
npm run tauri build  # Build distributable app
```

## Adding Features

### New Tauri Command
1. Add function in `src-tauri/src/lib.rs` with `#[tauri::command]`
2. Register in `invoke_handler` in `run()`
3. Add TS binding in `src/tauri.ts`

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

- First build requires network access to download Rust crates
- Corporate firewalls (Zscaler) may block crates.io

## Future Work (Deferred)

- HTML/PDF export
- Session persistence
- Find/Replace
- Synced scrolling
- Autosave/crash recovery
- CI/CD for multi-platform builds
