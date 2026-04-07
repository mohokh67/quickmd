import { useRef, useCallback } from 'react';
import { useStore } from '../store';

export function Divider() {
  const { setSplitRatio } = useStore();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const container = containerRef.current?.parentElement;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      setSplitRatio(Math.max(0.2, Math.min(0.8, ratio)));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [setSplitRatio]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      style={{
        width: '6px',
        cursor: 'col-resize',
        background: 'var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '2px', height: '30px', background: '#888', borderRadius: '2px' }} />
    </div>
  );
}
