import * as LucideIcons from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useUIStore } from '../../store/uiStore';
import type { CloudNodeData, GroupNodeData } from '../../types';

export function PropertiesPanel() {
  const { propertiesOpen } = useUIStore();
  const { selectedNodeId, selectedEdgeId, nodes, edges, updateNodeData, updateEdgeData, deleteSelected } =
    useCanvasStore();

  if (!propertiesOpen) return null;

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null;

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-72 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6">
        <LucideIcons.MousePointerClick size={32} className="text-gray-300 dark:text-gray-700 mb-3" />
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
          Click on a node or edge to view and edit its properties
        </p>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div className="w-72 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Connection</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Edge properties</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Label
            </label>
            <input
              type="text"
              value={selectedEdge.label?.toString() || ''}
              onChange={(e) => updateEdgeData(selectedEdge.id, { label: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="e.g., HTTPS, gRPC"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Animated
            </label>
            <button
              onClick={() => updateEdgeData(selectedEdge.id, { animated: !selectedEdge.animated })}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                selectedEdge.animated
                  ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}
            >
              {selectedEdge.animated ? 'On' : 'Off'}
            </button>
          </div>
          <button
            onClick={deleteSelected}
            className="w-full px-3 py-2 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10
              hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
          >
            Delete Connection
          </button>
        </div>
      </div>
    );
  }

  const isGroup = selectedNode!.type === 'groupNode';
  const nodeData = selectedNode!.data as unknown as (CloudNodeData & GroupNodeData);
  const iconName = nodeData.component?.icon || nodeData.icon || 'Box';
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName] || LucideIcons.Box;
  const color = nodeData.component?.color || nodeData.color || '#6366f1';

  return (
    <div className="w-72 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon size={18} style={{ color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {nodeData.component?.name || nodeData.label}
            </h3>
            <p className="text-[10px] text-gray-400">
              {isGroup ? 'Group Container' : nodeData.component?.provider?.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Label
          </label>
          <input
            type="text"
            value={nodeData.label || ''}
            onChange={(e) => updateNodeData(selectedNode!.id, { label: e.target.value })}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {isGroup && (
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={(nodeData as GroupNodeData).subtitle || ''}
              onChange={(e) => updateNodeData(selectedNode!.id, { subtitle: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="e.g., us-east-1a, 10.0.1.0/24"
            />
          </div>
        )}

        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Description
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">{nodeData.component?.description}</p>
        </div>

        {!isGroup && (
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Notes
            </label>
            <textarea
              value={(nodeData as CloudNodeData).notes || ''}
              onChange={(e) => updateNodeData(selectedNode!.id, { notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 resize-none
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="Add notes about this component..."
            />
          </div>
        )}

        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Details
          </label>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Type</span>
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {isGroup ? 'Group Container' : 'Component'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Provider</span>
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {(nodeData.component?.provider || nodeData.provider)?.toUpperCase()}
              </span>
            </div>
            {nodeData.component?.category && (
              <div className="flex justify-between">
                <span className="text-gray-400">Category</span>
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {nodeData.component.category}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Node ID</span>
              <span className="text-gray-600 dark:text-gray-300 font-mono text-[10px]">
                {selectedNode!.id.slice(0, 16)}...
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={deleteSelected}
          className="w-full px-3 py-2 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10
            hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
        >
          Delete {isGroup ? 'Group' : 'Node'}
        </button>
      </div>
    </div>
  );
}
