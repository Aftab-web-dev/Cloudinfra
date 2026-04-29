import { Cpu } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { Logo } from './Logo';

export function Header() {
  const { nodes, edges } = useCanvasStore();

  return (
    <header className="h-12 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center px-4 gap-3">
      <div className="flex items-center gap-2.5">
        <Logo size={30} className="drop-shadow-sm" />
        <div>
          <h1 className="text-sm font-bold leading-none tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            CloudInfra
          </h1>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-1 tracking-wide uppercase font-medium">
            Architecture Designer
          </p>
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
