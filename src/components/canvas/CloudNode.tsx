import { memo, useEffect, useState } from 'react';
import { Handle, Position, type NodeProps, useNodeId } from '@xyflow/react';
import * as LucideIcons from 'lucide-react';
import { AlertTriangle, XCircle } from 'lucide-react';
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
  const Icon =
    (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName] ||
    LucideIcons.Box;
  const provider = nodeData.component?.provider || 'generic';
  const color = nodeData.component?.color || '#6366f1';
  const accent = providerAccent[provider] || '#6366f1';

  const simActive = useSimulationStore((s) => s.active);
  const nodeStatus = useSimulationStore((s) =>
    nodeId ? s.nodeStatuses[nodeId] : undefined,
  );
  const health = nodeStatus?.health || 'healthy';
  const isSimulating = simActive && !!nodeStatus;

  // Brief pulse whenever a request hits this node
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (!nodeStatus?.lastRequestTime) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 700);
    return () => clearTimeout(t);
  }, [nodeStatus?.lastRequestTime, nodeStatus?.requestCount]);

  const iconColor = isSimulating && health === 'down' ? '#ef4444' : color;

  // Box ring: selection wins; otherwise reflect sim state
  const boxRing = selected
    ? 'ring-2 ring-indigo-400/80'
    : isSimulating && health === 'down'
    ? 'ring-2 ring-red-500'
    : isSimulating && health === 'degraded'
    ? 'ring-2 ring-amber-500'
    : isSimulating && pulse
    ? 'ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/40'
    : '';

  const showStats =
    isSimulating && nodeStatus && (nodeStatus.requestCount > 0 || nodeStatus.latencyMs > 0);

  return (
    <div
      className={`relative flex flex-col items-center gap-1.5 px-2 py-2 cursor-pointer transition-transform duration-200 ${
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
        className={`relative p-2 rounded-xl transition-all duration-200 ${boxRing} ${
          isSimulating && health === 'down' ? 'animate-pulse' : ''
        }`}
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={28} style={{ color: iconColor }} strokeWidth={1.6} />

        {/* Health badges (top-right corner of icon box) */}
        {isSimulating && health === 'down' && (
          <div className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900 p-0.5">
            <XCircle size={11} className="text-white" strokeWidth={2.5} />
          </div>
        )}
        {isSimulating && health === 'degraded' && (
          <div className="absolute -top-1.5 -right-1.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-gray-900 p-0.5">
            <AlertTriangle size={11} className="text-white" strokeWidth={2.5} />
          </div>
        )}

        {/* Pulse halo when receiving traffic */}
        {isSimulating && pulse && health === 'healthy' && (
          <div
            className="pointer-events-none absolute inset-0 rounded-xl animate-ping"
            style={{ backgroundColor: `${color}30` }}
          />
        )}
      </div>

      <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 max-w-[120px] text-center leading-tight truncate">
        {nodeData.label || nodeData.component?.name}
      </div>

      {/* Live stats during simulation */}
      {showStats && (
        <div className="flex items-center gap-1 text-[9px] font-mono leading-none">
          <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
            {nodeStatus!.requestCount}
          </span>
          {nodeStatus!.latencyMs > 0 && (
            <span
              className={`px-1.5 py-0.5 rounded ${
                nodeStatus!.latencyMs > 100
                  ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
            >
              {nodeStatus!.latencyMs}ms
            </span>
          )}
        </div>
      )}

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
