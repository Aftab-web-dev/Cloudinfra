import { useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  MarkerType,
  type Connection,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCanvasStore } from '../../store/canvasStore';
import { useUIStore } from '../../store/uiStore';
import { CloudNode } from './CloudNode';
import { GroupNode } from './GroupNode';
import { TextNode } from './TextNode';
import { TrafficAnimator } from './TrafficAnimator';
import type { CloudComponent, CanvasNode } from '../../types';
import type { ArchLayer } from '../../data/layers';
import type { TextPreset } from '../../data/texts';
import { getEdgeStyle } from '../../utils/edgeStyle';

const nodeTypes: NodeTypes = {
  cloudNode: CloudNode,
  groupNode: GroupNode,
  textNode: TextNode,
};

export function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    selectEdge,
  } = useCanvasStore();
  const { showMinimap, snapToGrid, gridSize, theme } = useUIStore();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const layerData = event.dataTransfer.getData('application/cloudinfra-layer');
      if (layerData) {
        const layer: ArchLayer = JSON.parse(layerData);
        const position = {
          x: event.clientX - bounds.left - 200,
          y: event.clientY - bounds.top - 120,
        };
        const newNode: CanvasNode = {
          id: `${layer.id}-${Date.now()}`,
          type: 'groupNode',
          position,
          style: { width: 420, height: 260 },
          data: {
            label: layer.name,
            color: layer.color,
            icon: layer.icon,
            provider: 'generic',
            subtitle: layer.description,
          },
        };
        addNode(newNode);
        return;
      }

      const textData = event.dataTransfer.getData('application/cloudinfra-text');
      if (textData) {
        const preset: TextPreset = JSON.parse(textData);
        const position = {
          x: event.clientX - bounds.left - 80,
          y: event.clientY - bounds.top - 16,
        };
        const newNode: CanvasNode = {
          id: `text-${Date.now()}`,
          type: 'textNode',
          position,
          style: { width: Math.max(160, preset.text.length * 8), height: Math.max(40, preset.fontSize * 1.6) },
          data: {
            text: preset.text,
            fontSize: preset.fontSize,
            fontWeight: preset.fontWeight,
            color: preset.color,
            align: 'left',
            italic: preset.italic ?? false,
            background: preset.background,
          },
        };
        addNode(newNode);
        return;
      }

      const componentData = event.dataTransfer.getData('application/cloudinfra');
      if (!componentData) return;

      const component: CloudComponent = JSON.parse(componentData);
      const isGroup =
        component.category === 'Infrastructure Groups' ||
        component.category === 'Network & Layers';

      const position = {
        x: event.clientX - bounds.left - (isGroup ? 150 : 70),
        y: event.clientY - bounds.top - (isGroup ? 100 : 25),
      };

      const newNode: CanvasNode = isGroup
        ? {
            id: `${component.type}-${Date.now()}`,
            type: 'groupNode',
            position,
            style: { width: 400, height: 300 },
            data: {
              label: component.name,
              color: component.color,
              icon: component.icon,
              provider: component.provider,
              component,
            },
          }
        : {
            id: `${component.type}-${Date.now()}`,
            type: 'cloudNode',
            position,
            data: {
              component,
              label: component.name,
              notes: '',
              config: {},
            },
          };

      addNode(newNode);
    },
    [addNode]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      onConnect(connection);
    },
    [onConnect]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: CanvasNode) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: { id: string }) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'smoothstep',
      animated: true,
      markerStart: { type: MarkerType.ArrowClosed, color: '#6366f1', width: 16, height: 16 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1', width: 16, height: 16 },
    }),
    []
  );

  // Always apply the latest edge styling (color by protocol + arrows on both ends)
  // so existing edges from older diagrams pick up the new look.
  const styledEdges = useMemo(
    () =>
      edges.map((e) => {
        const protocol =
          (e.data as { protocol?: string } | undefined)?.protocol ||
          (typeof e.label === 'string' ? e.label : undefined);
        const styleProps = getEdgeStyle(protocol);
        return {
          ...e,
          type: 'smoothstep' as const,
          animated: true,
          ...styleProps,
        };
      }),
    [edges]
  );

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full" tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        snapToGrid={snapToGrid}
        snapGrid={[gridSize, gridSize]}
        fitView
        deleteKeyCode={null}
        className="bg-gray-50 dark:bg-gray-950"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={gridSize}
          size={1}
          color={theme === 'dark' ? '#374151' : '#d1d5db'}
        />
        {showMinimap && (
          <MiniMap
            className="!bg-white/80 dark:!bg-gray-900/80 !rounded-xl !shadow-lg !border !border-gray-200 dark:!border-gray-700"
            maskColor={theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.1)'}
            nodeColor={(node) => {
              const data = node.data as Record<string, unknown>;
              const component = data?.component as Record<string, unknown> | undefined;
              return (component?.color as string) || '#6366f1';
            }}
          />
        )}
        <Controls
          className="!bg-white dark:!bg-gray-800 !rounded-xl !shadow-lg !border !border-gray-200 dark:!border-gray-700 [&>button]:!bg-white dark:[&>button]:!bg-gray-800 [&>button]:!border-gray-200 dark:[&>button]:!border-gray-700 [&>button]:!rounded-lg [&>button>svg]:!fill-gray-600 dark:[&>button>svg]:!fill-gray-300"
          position="bottom-right"
        />
        <TrafficAnimator />
      </ReactFlow>
    </div>
  );
}
