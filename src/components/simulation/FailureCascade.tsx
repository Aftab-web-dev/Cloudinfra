import { useState } from 'react';
import { AlertTriangle, Play, RotateCcw, ChevronDown } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useSimulationStore } from '../../store/simulationStore';
import { getServiceSpec } from '../../data/serviceSpecs';
import type { CloudNodeData } from '../../types';

interface CascadeResult {
  failedNode: string;
  failedNodeName: string;
  affectedNodes: { id: string; name: string; reason: string }[];
  impactScore: number; // 0-100
  estimatedDowntime: string;
  revenueImpact: string;
}

export function FailureCascade() {
  const { nodes, edges } = useCanvasStore();
  const { setNodeHealth, active } = useSimulationStore();
  const [selectedNode, setSelectedNode] = useState<string>('');
  const [result, setResult] = useState<CascadeResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const cloudNodes = nodes.filter((n) => n.type === 'cloudNode');

  if (!active) return null;

  const simulateFailure = (nodeId: string) => {
    const node = cloudNodes.find((n) => n.id === nodeId);
    if (!node) return;

    const nodeData = node.data as unknown as CloudNodeData;
    const nodeName = nodeData.label || nodeData.component?.name || 'Unknown';

    // Build adjacency (both directions for cascade)
    const downstream = new Map<string, string[]>();
    const upstream = new Map<string, string[]>();
    for (const e of edges) {
      if (!downstream.has(e.source)) downstream.set(e.source, []);
      downstream.get(e.source)!.push(e.target);
      if (!upstream.has(e.target)) upstream.set(e.target, []);
      upstream.get(e.target)!.push(e.source);
    }

    // Find all affected downstream nodes (cascade)
    const affected: { id: string; name: string; reason: string }[] = [];
    const visited = new Set<string>([nodeId]);
    const queue = [...(downstream.get(nodeId) || [])];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const currentNode = cloudNodes.find((n) => n.id === current);
      if (!currentNode) continue;

      const data = currentNode.data as unknown as CloudNodeData;
      const spec = getServiceSpec(data.component?.type || '');
      const name = data.label || data.component?.name || 'Unknown';

      // Check if all upstream dependencies are failed
      const upstreams = upstream.get(current) || [];
      const allUpstreamFailed = upstreams.every((u) => visited.has(u));
      const hasRedundancy = upstreams.length > 1 && !allUpstreamFailed;

      if (hasRedundancy) {
        affected.push({
          id: current,
          name,
          reason: 'Degraded (partial upstream failure, has redundancy)',
        });
      } else {
        affected.push({
          id: current,
          name,
          reason: spec.multiAz ? 'May failover (multi-AZ)' : 'Likely cascading failure',
        });
        // Continue cascading
        const nextNodes = downstream.get(current) || [];
        queue.push(...nextNodes);
      }
    }

    // Calculate impact
    const totalNodes = cloudNodes.length;
    const impactScore = Math.round((affected.length / Math.max(totalNodes - 1, 1)) * 100);

    // Estimate downtime based on failover capabilities
    const spec = getServiceSpec(nodeData.component?.type || '');
    let downtime = 'Unknown';
    if (spec.multiAz) {
      downtime = '< 30 seconds (auto-failover)';
    } else if (spec.scalingType === 'auto') {
      downtime = '1-5 minutes (auto-recovery)';
    } else {
      downtime = '5-60 minutes (manual intervention)';
    }

    // Revenue impact estimate (fictional but illustrative)
    const revenueImpact = impactScore > 70
      ? 'High — most services affected'
      : impactScore > 40
      ? 'Medium — partial service disruption'
      : impactScore > 10
      ? 'Low — isolated impact'
      : 'Minimal — no downstream impact';

    setResult({
      failedNode: nodeId,
      failedNodeName: nodeName,
      affectedNodes: affected,
      impactScore,
      estimatedDowntime: downtime,
      revenueImpact,
    });

    // Visualize on canvas
    setNodeHealth(nodeId, 'down');
    for (const a of affected) {
      if (a.reason.includes('Degraded')) {
        setNodeHealth(a.id, 'degraded');
      } else if (!a.reason.includes('failover')) {
        setNodeHealth(a.id, 'down');
      } else {
        setNodeHealth(a.id, 'degraded');
      }
    }
  };

  const resetCascade = () => {
    setResult(null);
    for (const node of cloudNodes) {
      setNodeHealth(node.id, 'healthy');
    }
  };

  const selectedNodeData = selectedNode
    ? (cloudNodes.find((n) => n.id === selectedNode)?.data as unknown as CloudNodeData)
    : null;

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-3">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <AlertTriangle size={11} />
        What-If Failure Analysis
      </div>

      <div className="flex items-center gap-2">
        {/* Node selector dropdown */}
        <div className="relative flex-1">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <span className="truncate">
              {selectedNodeData
                ? selectedNodeData.label || selectedNodeData.component?.name
                : 'Select a node to fail...'}
            </span>
            <ChevronDown size={12} className="flex-shrink-0 ml-1" />
          </button>
          {showDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto">
              {cloudNodes.map((node) => {
                const data = node.data as unknown as CloudNodeData;
                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      setSelectedNode(node.id);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    {data.label || data.component?.name}
                    <span className="text-gray-400 ml-1">({data.component?.category})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => selectedNode && simulateFailure(selectedNode)}
          disabled={!selectedNode}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-white bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 rounded-lg transition-colors"
        >
          <Play size={11} /> Simulate
        </button>
        {result && (
          <button
            onClick={resetCascade}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-2.5 space-y-2">
          {/* Impact meter */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-gray-400 w-12">Impact</span>
            <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  result.impactScore > 70 ? 'bg-red-500' :
                  result.impactScore > 40 ? 'bg-amber-500' :
                  result.impactScore > 10 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${result.impactScore}%` }}
              />
            </div>
            <span className={`text-[11px] font-bold w-8 text-right ${
              result.impactScore > 70 ? 'text-red-500' :
              result.impactScore > 40 ? 'text-amber-500' : 'text-green-500'
            }`}>
              {result.impactScore}%
            </span>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
              <div className="text-gray-400">Downtime</div>
              <div className="font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{result.estimatedDowntime}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
              <div className="text-gray-400">Affected</div>
              <div className="font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{result.affectedNodes.length} services</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
              <div className="text-gray-400">Revenue</div>
              <div className="font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{result.revenueImpact.split('—')[0].trim()}</div>
            </div>
          </div>

          {/* Affected nodes */}
          {result.affectedNodes.length > 0 && (
            <div className="max-h-24 overflow-y-auto space-y-0.5">
              {result.affectedNodes.map((a) => (
                <div key={a.id} className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded bg-red-50 dark:bg-red-500/5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    a.reason.includes('Degraded') ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{a.name}</span>
                  <span className="text-gray-400 truncate">— {a.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
