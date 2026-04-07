import { useMemo, useDeferredValue } from 'react';
import { marked } from 'marked';
import { useStore } from '../store';

// Configure marked for GFM
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function Preview() {
  const { content } = useStore();
  // Debounce via useDeferredValue for smooth real-time preview
  const deferredContent = useDeferredValue(content);

  const html = useMemo(() => {
    return marked.parse(deferredContent) as string;
  }, [deferredContent]);

  return (
    <div
      className="preview"
      style={{
        height: '100%',
        overflow: 'auto',
        padding: '1rem',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
