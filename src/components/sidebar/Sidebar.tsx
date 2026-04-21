import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Layout } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useCanvasStore } from '../../store/canvasStore';
import { providerLibraries, providerList } from '../../data';
import { designTemplates } from '../../data/templates';
import type { CloudComponent } from '../../types';

function DraggableComponent({ component }: { component: CloudComponent }) {
  const iconName = component.icon;
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName] || LucideIcons.Box;

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/cloudinfra', JSON.stringify(component));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing
        hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
      title={component.description}
    >
      <div
        className="p-1 rounded-md flex-shrink-0"
        style={{ backgroundColor: `${component.color}15` }}
      >
        <Icon size={16} style={{ color: component.color }} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
          {component.name}
        </div>
        <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
          {component.description}
        </div>
      </div>
    </div>
  );
}

function CategoryGroup({
  name,
  components,
  searchQuery,
}: {
  name: string;
  components: CloudComponent[];
  searchQuery: string;
}) {
  const [expanded, setExpanded] = useState(searchQuery.length > 0);

  const filtered = searchQuery
    ? components.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : components;

  if (filtered.length === 0) return null;

  const isExpanded = searchQuery.length > 0 || expanded;

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400
          hover:text-gray-700 dark:hover:text-gray-300 transition-colors uppercase tracking-wider"
      >
        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {name}
        <span className="ml-auto text-[10px] font-normal text-gray-400">{filtered.length}</span>
      </button>
      {isExpanded && (
        <div className="space-y-0.5 ml-1">
          {filtered.map((component) => (
            <DraggableComponent key={component.id} component={component} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { sidebarOpen, activeProvider, searchQuery, setActiveProvider, setSearchQuery, activeTab, setActiveTab } =
    useUIStore();
  const { loadDiagram } = useCanvasStore();
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  if (!sidebarOpen) return null;

  const library = providerLibraries[activeProvider];

  return (
    <div className="w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-colors
            ${activeTab === 'components'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Components
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-colors
            ${activeTab === 'templates'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Templates
        </button>
      </div>

      {activeTab === 'components' && (
        <>
          {/* Provider Tabs */}
          <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
            {providerList.map((p) => (
              <button
                key={p.key}
                onClick={() => setActiveProvider(p.key)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md whitespace-nowrap transition-all
                  ${activeProvider === p.key
                    ? 'text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                style={activeProvider === p.key ? { backgroundColor: p.color } : undefined}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Components */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {library.categories.map((cat) => (
              <CategoryGroup
                key={cat.name}
                name={cat.name}
                components={cat.components}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </>
      )}

      {activeTab === 'templates' && (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {designTemplates.map((template) => (
            <div key={template.id} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <button
                onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <Layout size={16} className="text-indigo-500 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">{template.name}</div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{template.pattern}</div>
                </div>
                {expandedTemplate === template.id ? (
                  <ChevronDown size={14} className="ml-auto text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronRight size={14} className="ml-auto text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedTemplate === template.id && (
                <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-800 pt-2">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">{template.description}</p>
                  <div className="text-[10px] text-gray-400 mb-2">
                    {template.nodes.length} nodes &middot; {template.edges.length} connections
                  </div>
                  <button
                    onClick={() => loadDiagram(template.nodes, template.edges)}
                    className="w-full px-3 py-1.5 text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600
                      rounded-lg transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
