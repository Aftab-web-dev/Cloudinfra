import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Layout, Plus, Type as TypeIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useCanvasStore } from '../../store/canvasStore';
import { providerLibraries, providerList } from '../../data';
import { designTemplates } from '../../data/templates';
import { archLayers, customLayerColors, type ArchLayer } from '../../data/layers';
import { textPresets, textSizePresets, textColorPresets, type TextPreset } from '../../data/texts';
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

function DraggableLayer({ layer }: { layer: ArchLayer }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[layer.icon] || LucideIcons.Layers;

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/cloudinfra-layer', JSON.stringify(layer));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing
        hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={layer.description}
    >
      <div
        className="p-1.5 rounded-md flex-shrink-0 border-2 border-dashed"
        style={{ borderColor: `${layer.color}80`, backgroundColor: `${layer.color}10` }}
      >
        <Icon size={14} style={{ color: layer.color }} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
          {layer.name}
        </div>
        <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
          {layer.description}
        </div>
      </div>
    </div>
  );
}

function CustomLayerBuilder() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('My Layer');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(customLayerColors[0].value);
  const [icon, setIcon] = useState('Layers');

  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[icon] || LucideIcons.Layers;

  const layer: ArchLayer = {
    id: `layer-custom-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    description,
    icon,
    color,
  };

  const onDragStart = (event: React.DragEvent) => {
    if (!name.trim()) return;
    event.dataTransfer.setData('application/cloudinfra-layer', JSON.stringify(layer));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
      >
        <Plus size={14} />
        Custom Layer
        {open ? <ChevronDown size={12} className="ml-auto" /> : <ChevronRight size={12} className="ml-auto" />}
      </button>
      {open && (
        <div className="p-3 space-y-2.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="My Layer"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Subtitle</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Color</label>
            <div className="flex flex-wrap gap-1.5">
              {customLayerColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${color === c.value ? 'scale-110 border-gray-700 dark:border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Icon</label>
            <div className="flex flex-wrap gap-1">
              {['Layers', 'Box', 'Shield', 'Database', 'Server', 'Cloud', 'Network', 'Cpu', 'Lock', 'Globe', 'Zap', 'Activity'].map((ic) => {
                const I = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[ic] || LucideIcons.Box;
                return (
                  <button
                    key={ic}
                    onClick={() => setIcon(ic)}
                    className={`p-1.5 rounded-md transition-colors ${icon === ic ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title={ic}
                  >
                    <I size={14} />
                  </button>
                );
              })}
            </div>
          </div>
          <div
            draggable={!!name.trim()}
            onDragStart={onDragStart}
            className={`mt-2 p-2.5 rounded-lg border-2 border-dashed text-center cursor-grab active:cursor-grabbing transition-all ${name.trim() ? '' : 'opacity-50 cursor-not-allowed'}`}
            style={{ borderColor: `${color}80`, backgroundColor: `${color}12` }}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Icon size={14} style={{ color }} strokeWidth={2} />
              <span className="text-[11px] font-bold" style={{ color }}>{name || 'Layer name'}</span>
            </div>
            <div className="text-[9px] text-gray-400 mt-1">Drag onto canvas</div>
          </div>
        </div>
      )}
    </div>
  );
}

function DraggableText({ preset }: { preset: TextPreset }) {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/cloudinfra-text', JSON.stringify(preset));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={preset.description}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{preset.name}</span>
        <span className="text-[9px] text-gray-400">{preset.fontSize}px</span>
      </div>
      <div
        className="px-2 py-1 rounded truncate"
        style={{
          fontSize: Math.min(preset.fontSize, 14),
          fontWeight: preset.fontWeight,
          color: preset.color,
          fontStyle: preset.italic ? 'italic' : 'normal',
          backgroundColor: preset.background || 'transparent',
        }}
      >
        {preset.text}
      </div>
    </div>
  );
}

function CustomTextBuilder() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('Custom text');
  const [size, setSize] = useState(textSizePresets[2]);
  const [color, setColor] = useState(textColorPresets[0].value);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  const preset: TextPreset = {
    id: 'text-custom',
    name: 'Custom',
    description: 'Custom text',
    text,
    fontSize: size.size,
    fontWeight: bold ? 700 : size.weight,
    color,
    italic,
  };

  const onDragStart = (event: React.DragEvent) => {
    if (!text.trim()) return;
    event.dataTransfer.setData('application/cloudinfra-text', JSON.stringify(preset));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
      >
        <Plus size={14} />
        Custom Text
        {open ? <ChevronDown size={12} className="ml-auto" /> : <ChevronRight size={12} className="ml-auto" />}
      </button>
      {open && (
        <div className="p-3 space-y-2.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="Type your text..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Size</label>
            <div className="flex gap-1">
              {textSizePresets.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSize(s)}
                  className={`flex-1 px-2 py-1 text-[10px] font-semibold rounded-md transition-colors ${size.name === s.name ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Color</label>
            <div className="flex flex-wrap gap-1.5">
              {textColorPresets.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${color === c.value ? 'scale-110 border-gray-700 dark:border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setBold(!bold)}
              className={`flex-1 px-2 py-1 text-xs font-bold rounded-md transition-colors ${bold ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              B
            </button>
            <button
              onClick={() => setItalic(!italic)}
              className={`flex-1 px-2 py-1 text-xs italic rounded-md transition-colors ${italic ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              I
            </button>
          </div>
          <div
            draggable={!!text.trim()}
            onDragStart={onDragStart}
            className={`mt-2 p-2.5 rounded-lg border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-center cursor-grab active:cursor-grabbing transition-all ${text.trim() ? '' : 'opacity-50 cursor-not-allowed'}`}
          >
            <div
              style={{
                fontSize: Math.min(size.size, 16),
                fontWeight: bold ? 700 : size.weight,
                color,
                fontStyle: italic ? 'italic' : 'normal',
              }}
            >
              {text || 'Custom text'}
            </div>
            <div className="text-[9px] text-gray-400 mt-1">Drag onto canvas</div>
          </div>
        </div>
      )}
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

  const filteredLayers = searchQuery
    ? archLayers.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : archLayers;

  const filteredText = searchQuery
    ? textPresets.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : textPresets;

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'components', label: 'Components' },
    { key: 'layers', label: 'Layers' },
    { key: 'text', label: 'Text' },
    { key: 'templates', label: 'Templates' },
  ];

  return (
    <div className="w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 px-2 py-2.5 text-[11px] font-semibold transition-colors
              ${activeTab === t.key
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {t.label}
          </button>
        ))}
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

      {activeTab === 'layers' && (
        <>
          <div className="p-2 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search layers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layout size={11} /> Predefined Layers
              <span className="ml-auto font-normal text-gray-400">{filteredLayers.length}</span>
            </div>
            <div className="space-y-0.5">
              {filteredLayers.map((layer) => (
                <DraggableLayer key={layer.id} layer={layer} />
              ))}
            </div>
            <div className="pt-2">
              <CustomLayerBuilder />
            </div>
            <p className="px-2 pt-1 text-[10px] text-gray-400 leading-relaxed">
              Drop a layer onto the canvas to create a labeled boundary. Resize and rename freely.
            </p>
          </div>
        </>
      )}

      {activeTab === 'text' && (
        <>
          <div className="p-2 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <TypeIcon size={11} /> Predefined Text
              <span className="ml-auto font-normal text-gray-400">{filteredText.length}</span>
            </div>
            <div className="space-y-0.5">
              {filteredText.map((preset) => (
                <DraggableText key={preset.id} preset={preset} />
              ))}
            </div>
            <div className="pt-2">
              <CustomTextBuilder />
            </div>
            <p className="px-2 pt-1 text-[10px] text-gray-400 leading-relaxed">
              Drag a text element onto the canvas. Double-click to edit, or change styling in the properties panel.
            </p>
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
