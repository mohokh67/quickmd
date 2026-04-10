import { contextBridge, ipcRenderer } from 'electron'

interface FileEntry {
  name: string
  path: string
  is_dir: boolean
}

contextBridge.exposeInMainWorld('api', {
  readFile: (filePath: string): Promise<string> =>
    ipcRenderer.invoke('read-file', filePath),

  writeFile: (filePath: string, content: string): Promise<void> =>
    ipcRenderer.invoke('write-file', filePath, content),

  listDirectory: (dirPath: string): Promise<FileEntry[]> =>
    ipcRenderer.invoke('list-directory', dirPath),

  getHomeDir: (): Promise<string> =>
    ipcRenderer.invoke('get-home-dir'),

  openFileDialog: (): Promise<string | null> =>
    ipcRenderer.invoke('open-file-dialog'),

  saveFileDialog: (defaultPath?: string): Promise<string | null> =>
    ipcRenderer.invoke('save-file-dialog', defaultPath),
})
