import { useEffect, useMemo, useState } from 'react';
import { X, FileCode2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCanvasStore } from '../../store/canvasStore';
import { previewMermaid, importMermaid } from '../../lib/mermaid/importer';

const SAMPLE = `flowchart LR
    User((Users)) --> CDN[CloudFront CDN]
    CDN --> ALB[Load Balancer]
    ALB --> API[API Gateway]
    API --> Auth[Cognito]
    API --> Lambda[Lambda]
    Lambda --> DB[(RDS Postgres)]
    Lambda --> Cache[(Redis)]
    Lambda --> S3[S3 Bucket]
    Lambda -.->|async| Queue[SQS]
    Queue --> Worker[Worker]`;

interface MermaidImportModalProps {
  open: boolean;
  onClose: () => void;
}

export function MermaidImportModal({ open, onClose }: MermaidImportModalProps) {
  const [source, setSource] = useState('');
  const importNodes = useCanvasStore((s) => s.importNodes);
  const existingNodes = useCanvasStore((s) => s.nodes);

  const preview = useMemo(() => {
    if (!source.trim()) return null;
    return previewMermaid(source);
  }, [source]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleImport = () => {
    const result = importMermaid(source);
    if (!result.ok) {
      toast.error(result.errors[0] ?? 'Failed to import');
      return;
    }
    let offsetY = 0;
    if (existingNodes.length > 0) {
      const maxY = Math.max(
        ...existingNodes.map((n) => (n.position?.y ?? 0) + (typeof n.height === 'number' ? n.height : 80)),
      );
      offsetY = maxY + 120;
    }
    const offsetNodes = result.nodes.map((n) => ({
      ...n,
      position: { x: n.position.x + 60, y: n.position.y + offsetY },
    }));
    importNodes(offsetNodes, result.edges);
    toast.success(
      `Imported ${result.stats.totalNodes} nodes, ${result.stats.totalEdges} edges` +
        (result.stats.fallbacks > 0 ? ` (${result.stats.fallbacks} generic)` : ''),
    );
    setSource('');
    onClose();
  };

  const fillSample = () => setSource(SAMPLE);
  const canImport = preview?.ok === true;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20">
              <FileCode2 size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                Import Mermaid Diagram
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Paste flowchart syntax — nodes auto-map to cloud components
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Mermaid source
            </label>
            <button
              onClick={fillSample}
              className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <Sparkles size={12} />
              Try an example
            </button>
          </div>
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder={`flowchart LR\n  User --> API[API Gateway]\n  API --> DB[(Database)]`}
            spellCheck={false}
            className="w-full h-56 px-3 py-2.5 text-xs font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />

          {/* Preview / errors */}
          {preview && (
            <div className="text-[11px]">
              {preview.ok ? (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">
                      {preview.stats.totalNodes} nodes, {preview.stats.totalEdges} edges
                    </span>
                    {preview.stats.totalSubgraphs > 0 && (
                      <span>, {preview.stats.totalSubgraphs} groups</span>
                    )}
                    <span className="ml-1.5 opacity-70">
                      ·{' '}
                      {preview.stats.exactMatches > 0 && `${preview.stats.exactMatches} exact, `}
                      {preview.stats.keywordMatches > 0 && `${preview.stats.keywordMatches} matched, `}
                      {preview.stats.fallbacks > 0 && `${preview.stats.fallbacks} generic`}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    {preview.errors.length === 0 ? (
                      <div>Could not parse source</div>
                    ) : (
                      preview.errors.slice(0, 3).map((err, i) => <div key={i}>{err}</div>)
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hint */}
          <div className="text-[10px] text-gray-400 dark:text-gray-500">
            Supports: <code className="font-mono">flowchart TD/LR</code>, node shapes (
            <code className="font-mono">[]</code>, <code className="font-mono">()</code>,{' '}
            <code className="font-mono">(())</code>, <code className="font-mono">{'{}'}</code>,{' '}
            <code className="font-mono">[()]</code>), edges (
            <code className="font-mono">--&gt;</code>, <code className="font-mono">-.-&gt;</code>,{' '}
            <code className="font-mono">==&gt;</code>), <code className="font-mono">|labels|</code>, and{' '}
            <code className="font-mono">subgraph</code> blocks.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!canImport}
            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm shadow-indigo-500/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Import to Canvas
          </button>
        </div>
      </div>
    </div>
  );
}
