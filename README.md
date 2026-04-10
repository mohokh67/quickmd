# QuickMD

A fast, cross-platform markdown editor with real-time preview.

Built with Electron (Node.js) + React + CodeMirror 6.

## Features

- Real-time markdown preview (GFM support)
- Three view modes: Editor, Preview, Split
- Resizable split view
- File browser sidebar with persistent workspace folder
- Light/dark themes (persisted across restarts)
- Keyboard shortcuts
- Native file dialogs

## Prerequisites

- [Node.js](https://nodejs.org/) 18+

That's it. No Rust, no platform-specific native dependencies.

## Installation

```bash
git clone https://github.com/mohokh67/quickmd.git
cd quickmd
npm install
npm run dev
```

## Development

```bash
npm run dev          # Start Electron app with hot-reload
npm run build        # Build main + preload + renderer
npm run package      # Build + package into platform installers
npm run lint         # ESLint
npm run format:check # Prettier check
```

A `Justfile` is also included for convenience (`just dev`, `just build`, `just package`, etc.).

### Build Output

| Platform | Location |
|----------|----------|
| macOS | `dist/*.dmg` |
| Windows | `dist/*.exe` |
| Linux | `dist/*.AppImage`, `dist/*.deb` |

## Usage

### Keyboard Shortcuts

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Save | Cmd+S | Ctrl+S |
| Open file | Cmd+O | Ctrl+O |
| Toggle sidebar | Cmd+B | Ctrl+B |
| Toggle preview | Cmd+P | Ctrl+P |
| Split view | Cmd+\ | Ctrl+\ |
| Toggle theme | Cmd+Shift+T | Ctrl+Shift+T |

### View Modes

- **Editor**: Full-width markdown editor
- **Preview**: Full-width rendered preview
- **Split**: Side-by-side editor and preview (default)

### File Browser

- Click "Open Folder" to pick a workspace folder (remembered across restarts)
- Click folders to expand/collapse
- Click `.md` files to open

## Tech Stack

- [Electron](https://www.electronjs.org/) — desktop app framework
- [electron-vite](https://electron-vite.org/) — build tooling
- [electron-builder](https://www.electron.build/) — packaging
- [React 18](https://react.dev/) — UI framework
- [CodeMirror 6](https://codemirror.net/) — editor
- [Zustand](https://zustand-demo.pmnd.rs/) — state management
- [marked](https://marked.js.org/) — markdown parser
- [electron-store](https://github.com/sindresorhus/electron-store) — settings persistence

## License

MIT
