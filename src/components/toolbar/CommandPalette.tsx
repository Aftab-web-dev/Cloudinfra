import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Undo2,
  Redo2,
  Save,
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Grid3X3,
  Map,
  PanelLeftClose,
  PanelRightClose,
  FileJson,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useUIStore } from '../../store/uiStore';
import { providerLibraries } from '../../data';
import { designTemplates } from '../../data/templates';
import type { CloudComponent, CloudProvider } from '../../types';
import toast from 'react-hot-toast';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'action' | 'component' | 'template';
  action: () => void;
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const allComponents = useMemo(() => {
    const comps: CloudComponent[] = [];
    const providers: CloudProvider[] = ['aws', 'azure', 'gcp', 'alibaba', 'generic'];
    for (const p of providers) {
      for (const cat of providerLibraries[p].categories) {
        comps.push(...cat.components);
      }
    }
    return comps;
  }, []);

  const commands = useMemo((): CommandItem[] => {
    const actions: CommandItem[] = [
      { id: 'undo', label: 'Undo', description: 'Ctrl+Z', icon: <Undo2 size={16} />, category: 'action', action: () => useCanvasStore.getState().undo() },
      { id: 'redo', label: 'Redo', description: 'Ctrl+Y', icon: <Redo2 size={16} />, category: 'action', action: () => useCanvasStore.getState().redo() },
      { id: 'save', label: 'Save Diagram', description: 'Ctrl+S', icon: <Save size={16} />, category: 'action', action: () => {
        const { nodes, edges } = useCanvasStore.getState();
        localStorage.setItem('cloudinfra-diagram', JSON.stringify({ nodes, edges, savedAt: new Date().toISOString() }));
        toast.success('Diagram saved');
      }},
      { id: 'load', label: 'Load Diagram', description: 'From local storage', icon: <Upload size={16} />, category: 'action', action: () => {
        const saved = localStorage.getItem('cloudinfra-diagram');
        if (saved) { const d = JSON.parse(saved); useCanvasStore.getState().loadDiagram(d.nodes, d.edges); toast.success('Loaded'); }
      }},
      { id: 'export-json', label: 'Export as JSON', description: 'Download diagram file', icon: <FileJson size={16} />, category: 'action', action: () => {
        const { nodes, edges } = useCanvasStore.getState();
        const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `cloudinfra-${Date.now()}.json`; a.click();
        toast.success('Exported');
      }},
      { id: 'clear', label: 'Clear Canvas', description: 'Remove all nodes', icon: <Trash2 size={16} />, category: 'action', action: () => { useCanvasStore.getState().clear(); toast.success('Cleared'); } },
      { id: 'toggle-theme', label: 'Toggle Dark Mode', description: 'Ctrl+Shift+T', icon: useUIStore.getState().theme === 'light' ? <Moon size={16} /> : <Sun size={16} />, category: 'action', action: () => useUIStore.getState().toggleTheme() },
      { id: 'toggle-sidebar', label: 'Toggle Sidebar', description: 'Ctrl+B', icon: <PanelLeftClose size={16} />, category: 'action', action: () => useUIStore.getState().toggleSidebar() },
      { id: 'toggle-properties', label: 'Toggle Properties', description: '', icon: <PanelRightClose size={16} />, category: 'action', action: () => useUIStore.getState().toggleProperties() },
      { id: 'toggle-grid', label: 'Toggle Snap to Grid', description: '', icon: <Grid3X3 size={16} />, category: 'action', action: () => useUIStore.getState().toggleSnapToGrid() },
      { id: 'toggle-minimap', label: 'Toggle Minimap', description: '', icon: <Map size={16} />, category: 'action', action: () => useUIStore.getState().toggleMinimap() },
      { id: 'export-download', label: 'Import JSON File', description: 'Load from file', icon: <Download size={16} />, category: 'action', action: () => {
        const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => { try { const d = JSON.parse(ev.target?.result as string); if (d.nodes) { useCanvasStore.getState().loadDiagram(d.nodes, d.edges); toast.success('Imported'); } } catch { toast.error('Invalid file'); } };
          reader.readAsText(file);
        };
        input.click();
      }},
    ];

    const templateItems: CommandItem[] = designTemplates.map((t) => ({
      id: `template-${t.id}`,
      label: t.name,
      description: t.pattern,
      icon: <LucideIcons.Layout size={16} className="text-indigo-500" />,
      category: 'template',
      action: () => {
        useCanvasStore.getState().loadDiagram(t.nodes, t.edges);
        toast.success(`Loaded: ${t.name}`);
      },
    }));

    const componentItems: CommandItem[] = allComponents.slice(0, 100).map((c) => {
      const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[c.icon] || LucideIcons.Box;
      return {
        id: `comp-${c.id}`,
        label: c.name,
        description: `${c.provider.toUpperCase()} · ${c.category}`,
        icon: <Icon size={16} style={{ color: c.color }} />,
        category: 'component',
        action: () => {
          const isGroup = c.category === 'Infrastructure Groups';
          const newNode = isGroup
            ? {
                id: `${c.type}-${Date.now()}`,
                type: 'groupNode' as const,
                position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
                style: { width: 400, height: 300 },
                data: { label: c.name, color: c.color, icon: c.icon, provider: c.provider, component: c },
              }
            : {
                id: `${c.type}-${Date.now()}`,
                type: 'cloudNode' as const,
                position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
                data: { component: c, label: c.name, notes: '', config: {} },
              };
          useCanvasStore.getState().addNode(newNode);
          toast.success(`Added: ${c.name}`);
        },
      };
    });

    return [...actions, ...templateItems, ...componentItems];
  }, [allComponents]);

  const filtered = useMemo(() => {
    if (!query) return commands.slice(0, 15);
    const q = query.toLowerCase();
    return commands
      .filter((c) => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .slice(0, 20);
  }, [query, commands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-[560px] max-h-[420px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, components, templates..."
            className="flex-1 text-sm bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="flex-1 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-400">No results found</div>
          )}
          {filtered.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                item.action();
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                ${index === selectedIndex
                  ? 'bg-indigo-50 dark:bg-indigo-500/10'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
            >
              <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">{item.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {item.label}
                </div>
                {item.description && (
                  <div className="text-[11px] text-gray-400 truncate">{item.description}</div>
                )}
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider
                  ${item.category === 'action' ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-500' : ''}
                  ${item.category === 'component' ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-500' : ''}
                  ${item.category === 'template' ? 'bg-purple-100 dark:bg-purple-500/15 text-purple-500' : ''}`}
              >
                {item.category}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-200 dark:border-gray-800 text-[10px] text-gray-400">
          <span><kbd className="font-mono">↑↓</kbd> Navigate</span>
          <span><kbd className="font-mono">Enter</kbd> Select</span>
          <span><kbd className="font-mono">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
