import { memo, useEffect, useRef, useState } from 'react';
import { type NodeProps, NodeResizer } from '@xyflow/react';
import { useCanvasStore } from '../../store/canvasStore';
import type { TextNodeData } from '../../types';

function TextNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as TextNodeData;
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(nodeData.text || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startEditing = () => {
    setDraft(nodeData.text || '');
    setEditing(true);
  };

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft !== nodeData.text) {
      updateNodeData(id, { text: draft });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setDraft(nodeData.text || '');
      setEditing(false);
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      commit();
    }
  };

  const sharedStyle: React.CSSProperties = {
    fontSize: `${nodeData.fontSize || 14}px`,
    fontWeight: nodeData.fontWeight || 500,
    color: nodeData.color || '#111827',
    fontStyle: nodeData.italic ? 'italic' : 'normal',
    textAlign: nodeData.align || 'left',
    backgroundColor: nodeData.background || 'transparent',
    lineHeight: 1.4,
  };

  const padding = nodeData.background ? '6px 10px' : '4px';
  const borderRadius = nodeData.background ? 8 : 4;

  return (
    <div
      className={`relative w-full h-full ${selected ? 'ring-2 ring-indigo-400/60 rounded-lg' : ''}`}
      onDoubleClick={startEditing}
      style={{ minWidth: 60, minHeight: 24 }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={60}
        minHeight={24}
        lineStyle={{ borderColor: '#6366f1', borderWidth: 1 }}
        handleStyle={{ backgroundColor: '#6366f1', width: 8, height: 8, borderRadius: 2 }}
      />
      {editing ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="w-full h-full outline-none border border-indigo-400 resize-none bg-white dark:bg-gray-900"
          style={{ ...sharedStyle, padding, borderRadius }}
        />
      ) : (
        <div
          className="w-full h-full whitespace-pre-wrap break-words cursor-text select-none"
          style={{ ...sharedStyle, padding, borderRadius }}
        >
          {nodeData.text || (
            <span className="opacity-40">Double-click to edit</span>
          )}
        </div>
      )}
    </div>
  );
}

export const TextNode = memo(TextNodeComponent);
