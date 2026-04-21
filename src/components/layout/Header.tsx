import { Cloud, Cpu } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';

export function Header() {
  const { nodes, edges } = useCanvasStore();

  return (
    <header className="h-12 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center px-4 gap-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
          <Cloud size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-none">CloudInfra</h1>
          <p className="text-[10px] text-gray-400 leading-none mt-0.5">Architecture Designer</p>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4 text-[10px] text-gray-400">
        <div className="flex items-center gap-1">
          <Cpu size={12} />
          <span>{nodes.length} nodes</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{edges.length} connections</span>
        </div>
      </div>
    </header>
  );
}
