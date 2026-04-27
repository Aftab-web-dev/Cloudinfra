import { useEffect, useState } from 'react';
import {
  Brain,
  Gauge,
  Shield,
  AlertTriangle,
  TrendingUp,
  Zap,
  ChevronRight,
  Target,
  Clock,
  Server,
  ArrowUpRight,
  Info,
  XCircle,
} from 'lucide-react';
import { useInsightsStore } from '../../store/insightsStore';
import { useCanvasStore } from '../../store/canvasStore';

type Tab = 'overview' | 'bottlenecks' | 'warnings';

export function InsightsPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { nodes, edges } = useCanvasStore();
  const {
    bottlenecks,
    overallAvailability,
    score,
    warnings,
    endToEndLatency,
    analyze,
  } = useInsightsStore();

  // Re-analyze when nodes/edges change
  useEffect(() => {
    analyze();
  }, [nodes, edges, analyze]);

  const cloudNodeCount = nodes.filter((n) => n.type === 'cloudNode').length;

  if (cloudNodeCount === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <Brain size={40} className="text-gray-300 dark:text-gray-700 mb-3" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Architecture Insights</p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
          Add services to your canvas to see real-time analysis
        </p>
      </div>
    );
  }

  const scoreColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-amber-500';
    if (value >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const scoreBarColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-amber-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-500/10';
      case 'high': return 'text-red-400 bg-red-50 dark:bg-red-500/10';
      case 'warning':
      case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10';
      case 'info':
      case 'low': return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-500/10';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 px-2">
        {([
          { id: 'overview', icon: Brain, label: 'Score' },
          { id: 'bottlenecks', icon: Target, label: 'Risks' },
          { id: 'warnings', icon: AlertTriangle, label: 'Tips' },
        ] as { id: Tab; icon: typeof Brain; label: string }[]).map(({ id, icon: TabIcon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1 px-2.5 py-2 text-[10px] font-semibold border-b-2 transition-colors ${
              activeTab === id
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <TabIcon size={12} />
            {label}
            {id === 'warnings' && warnings.length > 0 && (
              <span className="ml-0.5 px-1 py-0.5 text-[9px] rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                {warnings.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="text-center py-2">
              <div className={`text-4xl font-black ${scoreColor(score.overall)}`}>
                {score.overall}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">Architecture Score</div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-2.5">
              {[
                { label: 'Performance', value: score.performance, icon: Gauge },
                { label: 'Reliability', value: score.reliability, icon: Server },
                { label: 'Security', value: score.security, icon: Shield },
                { label: 'Scalability', value: score.scalability, icon: TrendingUp },
              ].map(({ label, value, icon: ScoreIcon }) => (
                <div key={label} className="flex items-center gap-2">
                  <ScoreIcon size={12} className="text-gray-400 flex-shrink-0" />
                  <span className="text-[11px] text-gray-600 dark:text-gray-300 w-20 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${scoreBarColor(value)}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-bold w-8 text-right ${scoreColor(value)}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock size={11} className="text-gray-400" />
                  <span className="text-[9px] text-gray-400 uppercase">E2E Latency</span>
                </div>
                <div className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  {endToEndLatency.min}-{endToEndLatency.max}ms
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap size={11} className="text-gray-400" />
                  <span className="text-[9px] text-gray-400 uppercase">Availability</span>
                </div>
                <div className={`text-sm font-bold ${
                  overallAvailability >= 99.9 ? 'text-green-500' :
                  overallAvailability >= 99 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {overallAvailability.toFixed(3)}%
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle size={11} className="text-gray-400" />
                  <span className="text-[9px] text-gray-400 uppercase">Issues</span>
                </div>
                <div className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  {bottlenecks.length + warnings.length}
                </div>
                <div className="text-[9px] text-gray-400">
                  {bottlenecks.filter((b) => b.severity === 'critical').length} critical
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bottlenecks' && (
          <div className="space-y-2">
            {bottlenecks.length === 0 ? (
              <div className="text-center py-8">
                <Target size={28} className="mx-auto text-green-400 mb-2" />
                <p className="text-xs text-gray-500">No bottlenecks detected</p>
                <p className="text-[10px] text-gray-400 mt-1">Architecture looks well-balanced</p>
              </div>
            ) : (
              bottlenecks.map((b, i) => (
                <div key={i} className={`p-2.5 rounded-lg ${severityColor(b.severity)}`}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold">{b.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/50 dark:bg-black/20 uppercase font-bold">
                          {b.severity}
                        </span>
                      </div>
                      <p className="text-[10px] mt-0.5 opacity-80">{b.reason}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <ArrowUpRight size={10} />
                        <span className="text-[10px] font-medium">{b.suggestion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'warnings' && (
          <div className="space-y-2">
            {warnings.length === 0 ? (
              <div className="text-center py-8">
                <Shield size={28} className="mx-auto text-green-400 mb-2" />
                <p className="text-xs text-gray-500">No warnings</p>
                <p className="text-[10px] text-gray-400 mt-1">Architecture follows best practices</p>
              </div>
            ) : (
              warnings.map((w) => (
                <div key={w.id} className={`p-2.5 rounded-lg ${severityColor(w.severity)}`}>
                  <div className="flex items-start gap-2">
                    {w.severity === 'critical' ? (
                      <XCircle size={14} className="flex-shrink-0 mt-0.5" />
                    ) : w.severity === 'warning' ? (
                      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info size={14} className="flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold">{w.title}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/50 dark:bg-black/20 uppercase font-bold">
                          {w.type}
                        </span>
                      </div>
                      <p className="text-[10px] mt-0.5 opacity-80">{w.description}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <ChevronRight size={10} />
                        <span className="text-[10px] font-medium">{w.suggestion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
