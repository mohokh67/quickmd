import { useStore } from '../store';
import { Editor } from './Editor';
import { Preview } from './Preview';
import { Divider } from './Divider';

export function EditorContainer() {
  const { viewMode, splitRatio } = useStore();

  if (viewMode === 'editor') {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Editor />
      </div>
    );
  }

  if (viewMode === 'preview') {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Preview />
      </div>
    );
  }

  // Split view
  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <div style={{ width: `${splitRatio * 100}%`, height: '100%' }}>
        <Editor />
      </div>
      <Divider />
      <div style={{ flex: 1, height: '100%' }}>
        <Preview />
      </div>
    </div>
  );
}
