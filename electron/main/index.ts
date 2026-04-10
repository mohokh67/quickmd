import { app, BrowserWindow, ipcMain } from 'electron'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'

interface FileEntry {
  name: string
  path: string
  is_dir: boolean
}

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
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('read-file', (_event, filePath: string): Promise<string> =>
  fs.readFile(filePath, 'utf-8')
)

ipcMain.handle('write-file', (_event, filePath: string, content: string): Promise<void> =>
  fs.writeFile(filePath, content, 'utf-8')
)

ipcMain.handle('list-directory', async (_event, dirPath: string): Promise<FileEntry[]> => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const result: FileEntry[] = []
  for (const entry of entries) {
    try {
      const entryPath = path.join(dirPath, entry.name)
      const stat = await fs.stat(entryPath)
      result.push({ name: entry.name, path: entryPath, is_dir: stat.isDirectory() })
    } catch {
      // skip unreadable entries / broken symlinks
    }
  }
  result.sort((a, b) => {
    if (a.is_dir !== b.is_dir) return a.is_dir ? -1 : 1
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  })
  return result
})

ipcMain.handle('get-home-dir', (): string => os.homedir())

// Stubs — implemented in issue #12
ipcMain.handle('open-file-dialog', () => { throw new Error('not implemented') })
ipcMain.handle('save-file-dialog', () => { throw new Error('not implemented') })
