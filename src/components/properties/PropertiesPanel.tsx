import * as LucideIcons from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useUIStore } from '../../store/uiStore';
import type { CloudNodeData, GroupNodeData, TextNodeData } from '../../types';
import { getServiceSpec } from '../../data/serviceSpecs';
import { textSizePresets, textColorPresets } from '../../data/texts';

export function PropertiesPanel() {
  const { propertiesOpen } = useUIStore();
  const { selectedNodeId, selectedEdgeId, nodes, edges, updateNodeData, updateEdgeData, deleteSelected } =
    useCanvasStore();

  if (!propertiesOpen) return null;

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null;

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6">
        <LucideIcons.MousePointerClick size={32} className="text-gray-300 dark:text-gray-700 mb-3" />
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
          Click on a node or edge to view and edit its properties
        </p>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
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
  const isText = selectedNode!.type === 'textNode';

  if (isText) {
    const textData = selectedNode!.data as unknown as TextNodeData;
    const updateText = (patch: Partial<TextNodeData>) =>
      updateNodeData(selectedNode!.id, patch as Partial<CloudNodeData & GroupNodeData & TextNodeData>);

    return (
      <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl shadow-sm bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
              <LucideIcons.Type size={20} className="text-indigo-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Text Element</h3>
              <p className="text-[10px] text-gray-400">Annotation</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Text</label>
            <textarea
              value={textData.text || ''}
              onChange={(e) => updateText({ text: e.target.value })}
              rows={3}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Size</label>
            <div className="flex gap-1">
              {textSizePresets.map((s) => (
                <button
                  key={s.name}
                  onClick={() => updateText({ fontSize: s.size })}
                  className={`flex-1 px-2 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                    Math.abs((textData.fontSize || 14) - s.size) < 2
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={8}
              max={96}
              value={textData.fontSize || 14}
              onChange={(e) => updateText({ fontSize: Number(e.target.value) || 14 })}
              className="mt-2 w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Color</label>
            <div className="flex flex-wrap gap-1.5">
              {textColorPresets.map((c) => (
                <button
                  key={c.value}
                  onClick={() => updateText({ color: c.value })}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${textData.color === c.value ? 'scale-110 border-gray-700 dark:border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
              <input
                type="color"
                value={textData.color || '#111827'}
                onChange={(e) => updateText({ color: e.target.value })}
                className="w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                title="Custom color"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Style</label>
            <div className="flex gap-1">
              <button
                onClick={() => updateText({ fontWeight: (textData.fontWeight || 500) >= 700 ? 400 : 700 })}
                className={`flex-1 px-2 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  (textData.fontWeight || 500) >= 700
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                B
              </button>
              <button
                onClick={() => updateText({ italic: !textData.italic })}
                className={`flex-1 px-2 py-1.5 text-xs italic rounded-md transition-colors ${
                  textData.italic
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                I
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Align</label>
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map((a) => {
                const I = a === 'left' ? LucideIcons.AlignLeft : a === 'center' ? LucideIcons.AlignCenter : LucideIcons.AlignRight;
                return (
                  <button
                    key={a}
                    onClick={() => updateText({ align: a })}
                    className={`flex-1 px-2 py-1.5 rounded-md transition-colors flex items-center justify-center ${
                      (textData.align || 'left') === a
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <I size={14} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textData.background || '#ffffff'}
                onChange={(e) => updateText({ background: e.target.value })}
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
              />
              <button
                onClick={() => updateText({ background: undefined })}
                className="flex-1 px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Transparent
              </button>
            </div>
          </div>

          <button
            onClick={deleteSelected}
            className="w-full px-3 py-2 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
          >
            Delete Text
          </button>
        </div>
      </div>
    );
  }

  const nodeData = selectedNode!.data as unknown as (CloudNodeData & GroupNodeData);
  const iconName = nodeData.component?.icon || nodeData.icon || 'Box';
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName] || LucideIcons.Box;
  const color = nodeData.component?.color || nodeData.color || '#6366f1';

  // Get service specs
  const spec = !isGroup ? getServiceSpec(nodeData.component?.type || '') : null;

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl shadow-sm" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">
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
              rows={2}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 resize-none
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="Add notes about this component..."
            />
          </div>
        )}

        {/* Service Specifications */}
        {spec && (
          <>
            <div className="pt-1">
              <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Service Specifications
              </label>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 space-y-2.5">
                {/* Performance */}
                <div className="flex items-center gap-2">
                  <LucideIcons.Gauge size={12} className="text-blue-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-400">Performance</div>
                    <div className="text-[11px] font-medium text-gray-700 dark:text-gray-200">
                      Latency: {spec.latencyMs[0]}-{spec.latencyMs[1]}ms
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Throughput: {spec.throughput}
                    </div>
                    {spec.iops && (
                      <div className="text-[10px] text-gray-500">IOPS: {spec.iops}</div>
                    )}
                  </div>
                </div>

                {/* Reliability */}
                <div className="flex items-center gap-2">
                  <LucideIcons.Shield size={12} className="text-purple-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-400">Reliability</div>
                    <div className="text-[11px] font-medium text-gray-700 dark:text-gray-200">
                      SLA: {spec.sla}%
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                        spec.multiAz ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                      }`}>
                        {spec.multiAz ? 'Multi-AZ' : 'Single-AZ'}
                      </span>
                      {spec.backupBuiltIn && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold">
                          Auto Backup
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Scaling */}
                <div className="flex items-center gap-2">
                  <LucideIcons.TrendingUp size={12} className="text-amber-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-400">Scaling</div>
                    <div className="text-[11px] font-medium text-gray-700 dark:text-gray-200">
                      {spec.scalingType === 'serverless' ? 'Serverless (auto)' :
                       spec.scalingType === 'auto' ? 'Auto-scaling' : 'Manual scaling'}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Max: {spec.maxScale}
                    </div>
                    {spec.coldStartMs && (
                      <div className="text-[9px] text-amber-500 mt-0.5">
                        Cold start: ~{spec.coldStartMs}ms
                      </div>
                    )}
                  </div>
                </div>

                {/* Compute specs if available */}
                {(spec.vCPU || spec.memory || spec.storage) && (
                  <div className="flex items-center gap-2">
                    <LucideIcons.Cpu size={12} className="text-gray-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-[10px] text-gray-400">Resources</div>
                      {spec.vCPU && <div className="text-[10px] text-gray-600 dark:text-gray-300">CPU: {spec.vCPU}</div>}
                      {spec.memory && <div className="text-[10px] text-gray-600 dark:text-gray-300">Memory: {spec.memory}</div>}
                      {spec.storage && <div className="text-[10px] text-gray-600 dark:text-gray-300">Storage: {spec.storage}</div>}
                    </div>
                  </div>
                )}

                {/* Networking */}
                {spec.bandwidth && (
                  <div className="flex items-center gap-2">
                    <LucideIcons.Network size={12} className="text-cyan-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-[10px] text-gray-400">Networking</div>
                      <div className="text-[10px] text-gray-600 dark:text-gray-300">Bandwidth: {spec.bandwidth}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
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
