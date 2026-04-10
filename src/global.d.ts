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
  storeGet(key: string): Promise<unknown>
  storeSet(key: string, value: unknown): Promise<void>
  openFolderDialog(): Promise<string | null>
}

declare interface Window {
  api: ElectronAPI
}
