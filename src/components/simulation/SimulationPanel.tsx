import {
  Play,
  Pause,
  RotateCcw,
  Send,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { useCanvasStore } from '../../store/canvasStore';

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function SimulationPanel() {
  const {
    active,
    nodeStatuses,
    requestLogs,
    packets,
    requestsPerSecond,
    autoTrafficInterval,
    sendRequest,
    toggleNodeHealth,
    startAutoTraffic,
    stopAutoTraffic,
    setRequestsPerSecond,
    reset,
  } = useSimulationStore();
  const { nodes } = useCanvasStore();
  const [expanded, setExpanded] = useState(true);

  if (!active) return null;

  const totalRequests = Object.values(nodeStatuses).reduce((s, n) => s + n.requestCount, 0);
  const downNodes = Object.entries(nodeStatuses).filter(([, s]) => s.health === 'down');
  const degradedNodes = Object.entries(nodeStatuses).filter(([, s]) => s.health === 'degraded');
  const inFlightCount = packets.filter((p) => p.status === 'in-flight' && p.progress >= 0).length;
  const successLogs = requestLogs.filter((r) => r.status === 'success');
  const failedLogs = requestLogs.filter((r) => r.status === 'failed');
  const avgLatency = successLogs.length > 0
    ? Math.round(successLogs.reduce((s, r) => s + r.latencyMs, 0) / successLogs.length)
    : 0;

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      {/* Header bar — always visible */}
      <div className="flex items-center gap-3 px-4 h-10">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>

        <div className="flex items-center gap-1.5">
          <Zap size={14} className="text-indigo-500" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">SIMULATION</span>
        </div>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-800" />

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-green-500">
            <CheckCircle2 size={12} /> {successLogs.length} OK
          </span>
          <span className="flex items-center gap-1 text-red-500">
            <XCircle size={12} /> {failedLogs.length} Failed
          </span>
          <span className="flex items-center gap-1 text-blue-500">
            <Activity size={12} /> {inFlightCount} In-flight
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <Clock size={12} /> {avgLatency}ms avg
          </span>
          {downNodes.length > 0 && (
            <span className="flex items-center gap-1 text-red-500 font-semibold">
              <AlertTriangle size={12} /> {downNodes.length} down
            </span>
          )}
        </div>

        <div className="flex-1" />

        {/* Controls */}
        <button
          onClick={() => sendRequest()}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
        >
          <Send size={12} /> Send Request
        </button>

        {autoTrafficInterval ? (
          <button
            onClick={stopAutoTraffic}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-lg transition-colors"
          >
            <Pause size={12} /> Stop Traffic
          </button>
        ) : (
          <button
            onClick={() => startAutoTraffic(requestsPerSecond)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-green-600 bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 rounded-lg transition-colors"
          >
            <Play size={12} /> Auto Traffic
          </button>
        )}

        <button
          onClick={reset}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Reset simulation"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="flex border-t border-gray-200 dark:border-gray-800 h-52 overflow-hidden">
          {/* Node Health Panel */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-800 overflow-y-auto p-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
              Node Health — click to toggle
            </div>
            <div className="space-y-0.5">
              {nodes
                .filter((n) => n.type === 'cloudNode')
                .map((node) => {
                  const data = node.data as Record<string, unknown>;
                  const comp = data?.component as Record<string, string> | undefined;
                  const status = nodeStatuses[node.id];
                  const health = status?.health || 'healthy';
                  const healthColor =
                    health === 'healthy' ? 'bg-green-500' : health === 'degraded' ? 'bg-amber-500' : 'bg-red-500';

                  return (
                    <button
                      key={node.id}
                      onClick={() => toggleNodeHealth(node.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left"
                    >
                      <div className={`w-2 h-2 rounded-full ${healthColor} flex-shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-medium text-gray-700 dark:text-gray-200 truncate">
                          {(data?.label as string) || comp?.name || 'Node'}
                        </div>
                      </div>
                      <div className="text-[9px] text-gray-400 flex-shrink-0">
                        {status?.requestCount || 0} req
                      </div>
                      {status?.latencyMs ? (
                        <div className="text-[9px] text-gray-400 flex-shrink-0 w-10 text-right">
                          {status.latencyMs}ms
                        </div>
                      ) : null}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Request Log */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Request Log
              </span>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-400">RPS:</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={requestsPerSecond}
                  onChange={(e) => setRequestsPerSecond(parseInt(e.target.value))}
                  className="w-16 h-1 accent-indigo-500"
                />
                <span className="text-[10px] text-gray-500 w-4">{requestsPerSecond}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              {requestLogs.map((log) => {
                const statusIcon =
                  log.status === 'success' ? (
                    <CheckCircle2 size={12} className="text-green-500" />
                  ) : log.status === 'failed' ? (
                    <XCircle size={12} className="text-red-500" />
                  ) : (
                    <Activity size={12} className="text-blue-500 animate-pulse" />
                  );

                // Resolve node labels
                const pathLabels = log.path.map((nodeId) => {
                  const node = nodes.find((n) => n.id === nodeId);
                  const data = node?.data as Record<string, unknown>;
                  return (data?.label as string) || (data?.component as Record<string, string>)?.name || nodeId.slice(0, 12);
                });

                return (
                  <div
                    key={log.id}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] ${
                      log.status === 'failed'
                        ? 'bg-red-50 dark:bg-red-500/5'
                        : log.status === 'success'
                        ? 'bg-green-50/50 dark:bg-green-500/5'
                        : 'bg-blue-50/50 dark:bg-blue-500/5'
                    }`}
                  >
                    {statusIcon}
                    <span className="text-[10px] text-gray-400 flex-shrink-0 w-16">
                      {formatTime(log.timestamp)}
                    </span>
                    <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
                      {pathLabels.map((label, i) => {
                        const isFailed = log.failedAt && log.path[i] === log.failedAt;
                        return (
                          <span key={i} className="flex items-center gap-1 flex-shrink-0">
                            {i > 0 && <span className="text-gray-300 dark:text-gray-600">→</span>}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                isFailed
                                  ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 line-through'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                              }`}
                            >
                              {label}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                    <span
                      className={`text-[10px] flex-shrink-0 font-mono ${
                        log.status === 'failed' ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      {log.latencyMs}ms
                    </span>
                  </div>
                );
              })}
              {requestLogs.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-400">
                  Click "Send Request" or start "Auto Traffic" to begin simulation
                </div>
              )}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="w-44 border-l border-gray-200 dark:border-gray-800 p-3 space-y-3">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stats</div>
            <div className="space-y-2">
              <div>
                <div className="text-[10px] text-gray-400">Total Requests</div>
                <div className="text-lg font-bold text-gray-800 dark:text-gray-100">{Math.round(totalRequests / Math.max(nodes.filter(n => n.type === 'cloudNode').length, 1))}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400">Avg Latency</div>
                <div className="text-lg font-bold text-gray-800 dark:text-gray-100">{avgLatency}ms</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400">Success Rate</div>
                <div className={`text-lg font-bold ${
                  requestLogs.length === 0 ? 'text-gray-400' :
                  failedLogs.length === 0 ? 'text-green-500' :
                  failedLogs.length / requestLogs.length > 0.5 ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {requestLogs.length === 0
                    ? '—'
                    : `${Math.round(((requestLogs.length - failedLogs.length) / requestLogs.length) * 100)}%`}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400">Degraded</div>
                <div className="text-sm font-bold text-amber-500">{degradedNodes.length} nodes</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400">Down</div>
                <div className="text-sm font-bold text-red-500">{downNodes.length} nodes</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
