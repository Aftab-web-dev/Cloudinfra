import { ReactFlowProvider } from '@xyflow/react';
import { Header } from './Header';
import { Toolbar } from '../toolbar/Toolbar';
import { Sidebar } from '../sidebar/Sidebar';
import { Canvas } from '../canvas/Canvas';
import { PropertiesPanel } from '../properties/PropertiesPanel';
import { SimulationPanel } from '../simulation/SimulationPanel';

export function AppLayout() {
  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
        <Header />
        <Toolbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <Canvas />
          <PropertiesPanel />
        </div>
        <SimulationPanel />
      </div>
    </ReactFlowProvider>
  );
}
