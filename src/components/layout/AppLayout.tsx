import { ReactFlowProvider } from '@xyflow/react';
import { Header } from './Header';
import { Toolbar } from '../toolbar/Toolbar';
import { Sidebar } from '../sidebar/Sidebar';
import { Canvas } from '../canvas/Canvas';
import { PropertiesPanel } from '../properties/PropertiesPanel';
import { SimulationPanel } from '../simulation/SimulationPanel';
import { InsightsPanel } from '../insights/InsightsPanel';
import { useUIStore } from '../../store/uiStore';

export function AppLayout() {
  const { insightsOpen } = useUIStore();

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
        <Header />
        <Toolbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <Canvas />
          <PropertiesPanel />
          {insightsOpen && (
            <div className="w-72 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
              <InsightsPanel />
            </div>
          )}
        </div>
        <SimulationPanel />
      </div>
    </ReactFlowProvider>
  );
}
