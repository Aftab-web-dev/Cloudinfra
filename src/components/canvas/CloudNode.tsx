import { memo } from 'react';
import { Handle, Position, type NodeProps, useNodeId } from '@xyflow/react';
import * as LucideIcons from 'lucide-react';
import type { CloudNodeData } from '../../types';
import { useSimulationStore } from '../../store/simulationStore';

const providerBorders: Record<string, string> = {
  aws: 'border-amber-500/60',
  azure: 'border-blue-500/60',
  gcp: 'border-blue-400/60',
  alibaba: 'border-orange-500/60',
  generic: 'border-indigo-500/60',
};

const providerBg: Record<string, string> = {
  aws: 'bg-amber-500/10',
  azure: 'bg-blue-500/10',
  gcp: 'bg-blue-400/10',
  alibaba: 'bg-orange-500/10',
  generic: 'bg-indigo-500/10',
};

const healthBorder: Record<string, string> = {
  healthy: '',
  degraded: '!border-amber-500',
  down: '!border-red-500 opacity-60',
};

const healthGlow: Record<string, string> = {
  healthy: '',
  degraded: 'shadow-amber-500/30',
  down: 'shadow-red-500/30',
};

function CloudNodeComponent({ data, selected }: NodeProps) {
  const nodeId = useNodeId();
  const nodeData = data as unknown as CloudNodeData;
  const iconName = nodeData.component?.icon || 'Box';
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName] || LucideIcons.Box;
  const provider = nodeData.component?.provider || 'generic';
  const color = nodeData.component?.color || '#6366f1';

  const simActive = useSimulationStore((s) => s.active);
  const nodeStatus = useSimulationStore((s) => nodeId ? s.nodeStatuses[nodeId] : undefined);

  const health = nodeStatus?.health || 'healthy';
  const isSimulating = simActive && nodeStatus;

  return (
    <div
      className={`
        relative px-4 py-3 rounded-xl border-2 shadow-lg backdrop-blur-sm
        min-w-[140px] max-w-[200px] cursor-pointer transition-all duration-200
        ${isSimulating && health !== 'healthy' ? healthBorder[health] : (providerBorders[provider] || 'border-gray-500/60')}
        ${providerBg[provider] || 'bg-gray-500/10'}
        ${isSimulating && health !== 'healthy' ? healthGlow[health] : ''}
        ${selected ? 'ring-2 ring-indigo-400 shadow-indigo-500/25 scale-105' : 'hover:shadow-xl hover:scale-[1.02]'}
        bg-white dark:bg-gray-900
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white dark:!border-gray-900"
      />

      {/* Health indicator dot */}
      {isSimulating && (
        <div className="absolute -top-1.5 -right-1.5 flex items-center gap-0.5">
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${
              health === 'healthy'
                ? 'bg-green-500'
                : health === 'degraded'
                ? 'bg-amber-500 animate-pulse'
                : 'bg-red-500 animate-pulse'
            }`}
          />
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <div
          className="p-1.5 rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon
            size={20}
            style={{ color: health === 'down' ? '#ef4444' : color }}
            strokeWidth={1.8}
          />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight">
            {nodeData.label || nodeData.component?.name}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate leading-tight mt-0.5">
            {nodeData.component?.name}
          </div>
        </div>
      </div>

      {/* Simulation stats bar */}
      {isSimulating && nodeStatus.requestCount > 0 && (
        <div className="mt-1.5 flex items-center gap-2 text-[9px]">
          <span className="text-gray-400">
            {nodeStatus.requestCount} req
          </span>
          {nodeStatus.latencyMs > 0 && (
            <span className={`font-mono ${
              health === 'degraded' ? 'text-amber-500' :
              health === 'down' ? 'text-red-500' :
              nodeStatus.latencyMs > 100 ? 'text-amber-500' : 'text-green-500'
            }`}>
              {nodeStatus.latencyMs}ms
            </span>
          )}
          {health === 'down' && (
            <span className="text-red-500 font-bold">DOWN</span>
          )}
        </div>
      )}

      {!isSimulating && nodeData.notes && (
        <div className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500 truncate">
          {nodeData.notes}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white dark:!border-gray-900"
      />
    </div>
  );
}

export const CloudNode = memo(CloudNodeComponent);
