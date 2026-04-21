import { memo } from 'react';
import { type NodeProps, NodeResizer } from '@xyflow/react';
import * as LucideIcons from 'lucide-react';
import type { GroupNodeData } from '../../types';

function GroupNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as GroupNodeData;
  const color = nodeData.color || '#6366f1';
  const iconName = nodeData.icon || 'Square';
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName] || LucideIcons.Square;

  return (
    <div
      className="relative w-full h-full rounded-2xl border-2 border-dashed"
      style={{
        borderColor: `${color}50`,
        backgroundColor: `${color}06`,
        minWidth: 300,
        minHeight: 200,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={300}
        minHeight={200}
        lineStyle={{ borderColor: color, borderWidth: 2 }}
        handleStyle={{ backgroundColor: color, width: 10, height: 10, borderRadius: 3 }}
      />
      <div
        className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-3 py-1.5 rounded-t-xl"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon size={13} style={{ color }} strokeWidth={2} />
        <span className="text-[11px] font-bold tracking-wide" style={{ color }}>
          {nodeData.label || 'Group'}
        </span>
        {nodeData.subtitle && (
          <span className="text-[9px] ml-1 opacity-60" style={{ color }}>
            {nodeData.subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

export const GroupNode = memo(GroupNodeComponent);
