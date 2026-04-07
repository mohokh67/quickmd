import { invoke } from '@tauri-apps/api/core';

export interface FileEntry {
  name: string;
  path: string;
  is_dir: boolean;
}

export async function readFile(path: string): Promise<string> {
  return invoke('read_file', { path });
}

export async function writeFile(path: string, content: string): Promise<void> {
  return invoke('write_file', { path, content });
}

export async function listDirectory(path: string): Promise<FileEntry[]> {
  return invoke('list_directory', { path });
}

export async function getHomeDir(): Promise<string> {
  return invoke('get_home_dir');
}
