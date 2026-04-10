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
