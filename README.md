# QuickMD

A fast, cross-platform markdown editor with real-time preview.

Built with Tauri (Rust) + React + CodeMirror 6.

## Features

- Real-time markdown preview (GFM support)
- Three view modes: Editor, Preview, Split
- Resizable split view
- File browser sidebar
- Light/dark themes
- Keyboard shortcuts
- Native file dialogs

## Prerequisites

### All Platforms

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) 1.70+

### macOS

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Rust (if not installed)
brew install rust
# OR
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Windows

1. Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - Select "Desktop development with C++"
2. Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually pre-installed on Windows 10/11)
3. Install Rust:
   ```powershell
   winget install Rustlang.Rust.MSVC
   # OR download from https://rustup.rs
   ```

### Linux (Debian/Ubuntu)

```bash
# System dependencies
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### Linux (Fedora)

```bash
sudo dnf install webkit2gtk4.1-devel openssl-devel curl wget file \
  libxdo-devel librsvg2-devel

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### Linux (Arch)

```bash
sudo pacman -S webkit2gtk-4.1 base-devel curl wget file openssl \
  libxdo librsvg

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

## Installation

```bash
# Clone and enter directory
cd quickmd

# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

First run will compile Rust dependencies (2-5 minutes).

## Development

```bash
# Start dev server (hot reload)
npm run tauri dev

# Build frontend only
npm run build

# Build distributable app
npm run tauri build
```

### Build Output Locations

| Platform | Location |
|----------|----------|
| macOS | `src-tauri/target/release/bundle/dmg/` |
| Windows | `src-tauri/target/release/bundle/msi/` |
| Linux | `src-tauri/target/release/bundle/appimage/` |

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

- Click folders to expand/collapse
- Click `.md` files to open
- Toggle with sidebar button or Cmd/Ctrl+B

## Troubleshooting

### "failed to download from crates.io"

Corporate firewalls may block Rust package downloads. Solutions:
- Use personal network/hotspot
- Request IT to allowlist `crates.io` and `static.crates.io`

### "cargo not found"

Rust not installed or not in PATH:
```bash
# Check installation
rustc --version

# If not found, install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### Linux: "webkit2gtk not found"

Install system dependencies (see Linux prerequisites above).

### Windows: Build fails

Ensure Visual Studio Build Tools are installed with C++ workload.

## Tech Stack

- [Tauri 2.x](https://tauri.app/) - Native app framework
- [React 18](https://react.dev/) - UI framework
- [CodeMirror 6](https://codemirror.net/) - Code editor
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [marked](https://marked.js.org/) - Markdown parser
- [Vite](https://vitejs.dev/) - Build tool

## License

MIT
