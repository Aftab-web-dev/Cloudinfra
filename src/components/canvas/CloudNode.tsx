import { memo } from 'react';
import { Handle, Position, type NodeProps, useNodeId } from '@xyflow/react';
import * as LucideIcons from 'lucide-react';
import type { CloudNodeData } from '../../types';
import { useSimulationStore } from '../../store/simulationStore';

const providerAccent: Record<string, string> = {
  aws: '#FF9900',
  azure: '#0078D4',
  gcp: '#4285F4',
  alibaba: '#FF6A00',
  generic: '#6366f1',
};

function CloudNodeComponent({ data, selected }: NodeProps) {
  const nodeId = useNodeId();
  const nodeData = data as unknown as CloudNodeData;
  const iconName = nodeData.component?.icon || 'Box';
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName] || LucideIcons.Box;
  const provider = nodeData.component?.provider || 'generic';
  const color = nodeData.component?.color || '#6366f1';
  const accent = providerAccent[provider] || '#6366f1';

  const simActive = useSimulationStore((s) => s.active);
  const nodeStatus = useSimulationStore((s) => (nodeId ? s.nodeStatuses[nodeId] : undefined));
  const health = nodeStatus?.health || 'healthy';
  const isSimulating = simActive && nodeStatus;

  const iconColor = isSimulating && health === 'down' ? '#ef4444' : color;

  return (
    <div
      className={`flex flex-col items-center gap-1.5 px-2 py-2 cursor-pointer transition-transform duration-200 ${
        selected ? 'scale-110' : 'hover:scale-105'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !border-2 !border-white dark:!border-gray-900 !-top-1"
        style={{ backgroundColor: accent }}
      />

      <div
        className={`p-2 rounded-xl ${selected ? 'ring-2 ring-indigo-400/80' : ''}`}
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={28} style={{ color: iconColor }} strokeWidth={1.6} />
      </div>

      <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 max-w-[120px] text-center leading-tight truncate">
        {nodeData.label || nodeData.component?.name}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !border-2 !border-white dark:!border-gray-900 !-bottom-1"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}

export const CloudNode = memo(CloudNodeComponent);
