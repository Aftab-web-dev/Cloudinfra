import { useEffect, useState } from 'react';
import {
  Undo2,
  Redo2,
  Trash2,
  Download,
  Upload,
  Grid3X3,
  Map,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  FileJson,
  FileCode2,
  Image,
  FileImage,
  FileText,
  Cog,
  LayoutDashboard,
  Search,
  Zap,
  ZapOff,
  Brain,
  Presentation,
} from 'lucide-react';
import { getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { generateTerraform } from '../../utils/terraformExport';
import { exportToPptx } from '../../utils/pptxExport';
import { useCanvasStore } from '../../store/canvasStore';
import { useUIStore } from '../../store/uiStore';
import { useSimulationStore } from '../../store/simulationStore';
import { autoLayoutHierarchical } from '../../utils/layout';
import { MermaidImportModal } from './MermaidImportModal';
import toast from 'react-hot-toast';

export function Toolbar() {
  const [mermaidOpen, setMermaidOpen] = useState(false);
  const { undo, redo, canUndo, canRedo, clear, nodes, edges, setNodes, pushHistory } = useCanvasStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'v' || e.key === 'V')) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
        e.preventDefault();
        setMermaidOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const {
    theme,
    toggleTheme,
    showMinimap,
    toggleMinimap,
    snapToGrid,
    toggleSnapToGrid,
    sidebarOpen,
    toggleSidebar,
    propertiesOpen,
    toggleProperties,
    insightsOpen,
    toggleInsights,
  } = useUIStore();

  const handleExportJSON = () => {
    const data = JSON.stringify({ nodes, edges, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudinfra-diagram-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Diagram exported as JSON');
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.nodes && data.edges) {
            useCanvasStore.getState().loadDiagram(data.nodes, data.edges);
            toast.success('Diagram imported successfully');
          } else {
            toast.error('Invalid diagram file');
          }
        } catch {
          toast.error('Failed to parse JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const exportImage = async (format: 'png' | 'svg' | 'pdf') => {
    if (nodes.length === 0) {
      toast.error('Canvas is empty');
      return;
    }
    const viewportEl = document.querySelector('.react-flow__viewport') as HTMLElement | null;
    if (!viewportEl) {
      toast.error('Canvas not ready');
      return;
    }

    const padding = 40;
    const bounds = getNodesBounds(nodes);
    const imageWidth = Math.min(4096, Math.max(800, Math.ceil(bounds.width + padding * 2)));
    const imageHeight = Math.min(4096, Math.max(600, Math.ceil(bounds.height + padding * 2)));
    const viewport = getViewportForBounds(bounds, imageWidth, imageHeight, 0.5, 2, 0.1);

    const bg = theme === 'dark' ? '#0a0a0f' : '#f9fafb';
    const filterNode = (node: HTMLElement) => {
      const cls = node.classList;
      if (!cls) return true;
      // Drop UI chrome that shouldn't appear in the exported image
      return !(
        cls.contains('react-flow__minimap') ||
        cls.contains('react-flow__controls') ||
        cls.contains('react-flow__panel')
      );
    };
    const opts = {
      backgroundColor: bg,
      width: imageWidth,
      height: imageHeight,
      filter: filterNode,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
      pixelRatio: 2,
    };

    const toastId = toast.loading(`Exporting ${format.toUpperCase()}…`);
    try {
      if (format === 'pdf') {
        const dataUrl = await toPng(viewportEl, opts);
        const orientation: 'l' | 'p' = imageWidth >= imageHeight ? 'l' : 'p';
        const pdf = new jsPDF({ orientation, unit: 'pt', format: [imageWidth, imageHeight] });
        pdf.addImage(dataUrl, 'PNG', 0, 0, imageWidth, imageHeight);
        pdf.save(`cloudinfra-diagram-${Date.now()}.pdf`);
        toast.success('PDF downloaded', { id: toastId });
        return;
      }

      const dataUrl = format === 'png' ? await toPng(viewportEl, opts) : await toSvg(viewportEl, opts);
      const link = document.createElement('a');
      link.download = `cloudinfra-diagram-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
      toast.success(`${format.toUpperCase()} downloaded`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Export failed — check console', { id: toastId });
    }
  };

  const handleExportPNG = () => exportImage('png');
  const handleExportSVG = () => exportImage('svg');
  const handleExportPDF = () => exportImage('pdf');

  const handleExportPPTX = async (mode: 'editable' | 'image') => {
    if (nodes.length === 0) {
      toast.error('Canvas is empty');
      return;
    }
    const toastId = toast.loading(
      mode === 'editable' ? 'Building editable PPTX…' : 'Capturing diagram for PPTX…',
    );
    try {
      let imageDataUrl: string | undefined;
      if (mode === 'image') {
        const viewportEl = document.querySelector(
          '.react-flow__viewport',
        ) as HTMLElement | null;
        if (!viewportEl) {
          toast.error('Canvas not ready', { id: toastId });
          return;
        }
        const padding = 40;
        const bounds = getNodesBounds(nodes);
        const imageWidth = Math.min(
          4096,
          Math.max(800, Math.ceil(bounds.width + padding * 2)),
        );
        const imageHeight = Math.min(
          4096,
          Math.max(600, Math.ceil(bounds.height + padding * 2)),
        );
        const viewport = getViewportForBounds(
          bounds,
          imageWidth,
          imageHeight,
          0.5,
          2,
          0.1,
        );
        const bg = theme === 'dark' ? '#0a0a0f' : '#f9fafb';
        const filterNode = (node: HTMLElement) => {
          const cls = node.classList;
          if (!cls) return true;
          return !(
            cls.contains('react-flow__minimap') ||
            cls.contains('react-flow__controls') ||
            cls.contains('react-flow__panel')
          );
        };
        imageDataUrl = await toPng(viewportEl, {
          backgroundColor: bg,
          width: imageWidth,
          height: imageHeight,
          filter: filterNode,
          style: {
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          },
          pixelRatio: 2,
        });
      }
      await exportToPptx({ nodes, edges, theme, mode, imageDataUrl });
      toast.success(
        mode === 'editable' ? 'Editable PPTX downloaded' : 'PPTX (image) downloaded',
        { id: toastId },
      );
    } catch (err) {
      console.error(err);
      toast.error('PPTX export failed — check console', { id: toastId });
    }
  };

  const handleExportPPTXEditable = () => handleExportPPTX('editable');
  const handleExportPPTXImage = () => handleExportPPTX('image');

  const handleExportTerraform = () => {
    if (nodes.length === 0) {
      toast.error('Canvas is empty');
      return;
    }
    try {
      const hcl = generateTerraform(nodes, edges);
      const blob = new Blob([hcl], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cloudinfra-${Date.now()}.tf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Terraform (.tf) downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Terraform export failed — check console');
    }
  };

  const handleSave = () => {
    const data = JSON.stringify({ nodes, edges, savedAt: new Date().toISOString() });
    localStorage.setItem('cloudinfra-diagram', data);
    toast.success('Diagram saved locally');
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('cloudinfra-diagram');
    if (saved) {
      const data = JSON.parse(saved);
      useCanvasStore.getState().loadDiagram(data.nodes, data.edges);
      toast.success('Diagram loaded');
    } else {
      toast('No saved diagram found', { icon: '📋' });
    }
  };

  const handleAutoLayout = () => {
    if (nodes.length === 0) return;
    const laid = autoLayoutHierarchical(nodes, edges);
    setNodes(laid);
    pushHistory();
    toast.success('Auto-layout applied');
  };

  const btnClass =
    'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed';
  const activeBtnClass =
    'p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-colors';

  return (
    <div className="h-12 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center gap-1 px-2">
      {/* Sidebar toggle */}
      <button onClick={toggleSidebar} className={btnClass} title="Toggle sidebar">
        {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
      </button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1" />

      {/* Undo/Redo */}
      <button onClick={undo} disabled={!canUndo()} className={btnClass} title="Undo (Ctrl+Z)">
        <Undo2 size={18} />
      </button>
      <button onClick={redo} disabled={!canRedo()} className={btnClass} title="Redo (Ctrl+Y)">
        <Redo2 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1" />

      {/* Canvas controls */}
      <button onClick={toggleSnapToGrid} className={snapToGrid ? activeBtnClass : btnClass} title="Snap to grid">
        <Grid3X3 size={18} />
      </button>
      <button onClick={toggleMinimap} className={showMinimap ? activeBtnClass : btnClass} title="Toggle minimap">
        <Map size={18} />
      </button>
      <button onClick={handleAutoLayout} disabled={nodes.length === 0} className={btnClass} title="Auto-layout">
        <LayoutDashboard size={18} />
      </button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1" />

      {/* Save/Load */}
      <button onClick={handleSave} className={btnClass} title="Save diagram (local)">
        <Download size={18} />
      </button>
      <button onClick={handleLoad} className={btnClass} title="Load saved diagram">
        <Upload size={18} />
      </button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1" />

      {/* Export */}
      <button onClick={handleExportJSON} className={btnClass} title="Export as JSON">
        <FileJson size={18} />
      </button>
      <button onClick={handleImportJSON} className={btnClass} title="Import JSON">
        <Upload size={18} />
      </button>
      <button
        onClick={() => setMermaidOpen(true)}
        className={btnClass}
        title="Import Mermaid (Ctrl+Shift+V)"
      >
        <FileCode2 size={18} />
      </button>
      <button onClick={handleExportPNG} className={btnClass} title="Export as PNG">
        <Image size={18} />
      </button>
      <button onClick={handleExportSVG} className={btnClass} title="Export as SVG">
        <FileImage size={18} />
      </button>
      <button onClick={handleExportPDF} className={btnClass} title="Export as PDF">
        <FileText size={18} />
      </button>
      <button
        onClick={handleExportPPTXEditable}
        className={btnClass}
        title="Export as PowerPoint (editable shapes)"
      >
        <Presentation size={18} />
      </button>
      <button
        onClick={handleExportPPTXImage}
        className={btnClass}
        title="Export as PowerPoint (image)"
      >
        <Presentation size={18} strokeWidth={1.2} />
      </button>
      <button onClick={handleExportTerraform} className={btnClass} title="Export as Terraform (.tf)">
        <Cog size={18} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Command Palette hint */}
      <button
        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
        title="Command Palette (Ctrl+K)"
      >
        <Search size={14} />
        <span className="text-[11px]">Search</span>
        <kbd className="text-[9px] px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono ml-1">Ctrl+K</kbd>
      </button>

      {/* Simulate toggle */}
      <SimulateButton />

      {/* Clear */}
      <button
        onClick={() => {
          if (nodes.length === 0 || window.confirm('Clear the entire canvas?')) {
            clear();
            toast.success('Canvas cleared');
          }
        }}
        className={`${btnClass} hover:!text-red-500`}
        title="Clear canvas"
      >
        <Trash2 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1" />

      {/* Theme */}
      <button onClick={toggleTheme} className={btnClass} title="Toggle theme">
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Insights toggle */}
      <button onClick={toggleInsights} className={insightsOpen ? activeBtnClass : btnClass} title="Toggle architecture insights">
        <Brain size={18} />
      </button>

      {/* Properties toggle */}
      <button onClick={toggleProperties} className={btnClass} title="Toggle properties panel">
        {propertiesOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
      </button>

      <MermaidImportModal open={mermaidOpen} onClose={() => setMermaidOpen(false)} />
    </div>
  );
}

function SimulateButton() {
  const { active, toggleSimulation } = useSimulationStore();
  return (
    <button
      onClick={toggleSimulation}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
        active
          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
      }`}
      title={active ? 'Stop Simulation' : 'Start Simulation'}
    >
      {active ? <ZapOff size={14} /> : <Zap size={14} />}
      {active ? 'Stop Sim' : 'Simulate'}
    </button>
  );
}
