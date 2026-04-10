export interface FileEntry {
  name: string
  path: string
  is_dir: boolean
}

export async function readFile(path: string): Promise<string> {
  return window.api.readFile(path)
}

export async function writeFile(path: string, content: string): Promise<void> {
  return window.api.writeFile(path, content)
}

export async function listDirectory(path: string): Promise<FileEntry[]> {
  return window.api.listDirectory(path)
}

export async function getHomeDir(): Promise<string> {
  return window.api.getHomeDir()
}

export async function storeGet(key: string): Promise<unknown> {
  return window.api.storeGet(key)
}

export async function storeSet(key: string, value: unknown): Promise<void> {
  return window.api.storeSet(key, value)
}

export async function openFolderDialog(): Promise<string | null> {
  return window.api.openFolderDialog()
}
