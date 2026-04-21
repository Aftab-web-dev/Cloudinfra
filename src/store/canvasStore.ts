import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import type { CanvasNode, CanvasEdge } from '../types';
import { getSmartLabel } from '../utils/smartLabels';

interface HistoryEntry {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

interface CanvasState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // History
  history: HistoryEntry[];
  historyIndex: number;

  // Actions
  onNodesChange: (changes: NodeChange<CanvasNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<CanvasEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: CanvasNode) => void;
  updateNodeData: (nodeId: string, data: Partial<CanvasNode['data']>) => void;
  updateEdgeData: (edgeId: string, data: Partial<CanvasEdge>) => void;
  deleteSelected: () => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setNodes: (nodes: CanvasNode[]) => void;
  setEdges: (edges: CanvasEdge[]) => void;
  loadDiagram: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  clear: () => void;

  // Clipboard
  clipboard: CanvasNode | null;
  copySelected: () => void;
  paste: () => void;
  selectAll: () => void;

  // History actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  history: [{ nodes: [], edges: [] }],
  historyIndex: 0,

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as CanvasNode[],
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges) as CanvasEdge[],
    }));
  },

  onConnect: (connection) => {
    const { nodes } = get();
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    const smartLabel = sourceNode && targetNode ? getSmartLabel(sourceNode, targetNode) : undefined;

    const newEdge: CanvasEdge = {
      ...connection,
      id: `e-${connection.source}-${connection.target}-${Date.now()}`,
      type: 'smoothstep',
      animated: true,
      label: smartLabel,
      style: { stroke: '#6366f1', strokeWidth: 2 },
      data: { protocol: smartLabel || '', description: '' },
    };
    set((state) => ({
      edges: addEdge(newEdge, state.edges) as CanvasEdge[],
    }));
    get().pushHistory();
  },

  addNode: (node) => {
    set((state) => ({ nodes: [...state.nodes, node] }));
    get().pushHistory();
  },

  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ) as CanvasNode[],
    }));
  },

  updateEdgeData: (edgeId, data) => {
    set((state) => ({
      edges: state.edges.map((e) =>
        e.id === edgeId ? { ...e, ...data } : e
      ) as CanvasEdge[],
    }));
  },

  deleteSelected: () => {
    const { selectedNodeId, selectedEdgeId } = get();
    if (selectedNodeId) {
      set((state) => ({
        nodes: state.nodes.filter((n) => n.id !== selectedNodeId),
        edges: state.edges.filter(
          (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
        ),
        selectedNodeId: null,
      }));
      get().pushHistory();
    } else if (selectedEdgeId) {
      set((state) => ({
        edges: state.edges.filter((e) => e.id !== selectedEdgeId),
        selectedEdgeId: null,
      }));
      get().pushHistory();
    }
  },

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  loadDiagram: (nodes, edges) => {
    set({
      nodes,
      edges,
      selectedNodeId: null,
      selectedEdgeId: null,
      history: [{ nodes, edges }],
      historyIndex: 0,
    });
  },

  clipboard: null,

  copySelected: () => {
    const { selectedNodeId, nodes } = get();
    if (!selectedNodeId) return;
    const node = nodes.find((n) => n.id === selectedNodeId);
    if (node) {
      set({ clipboard: JSON.parse(JSON.stringify(node)) });
    }
  },

  paste: () => {
    const { clipboard } = get();
    if (!clipboard) return;
    const newNode: CanvasNode = {
      ...JSON.parse(JSON.stringify(clipboard)),
      id: `${clipboard.type}-paste-${Date.now()}`,
      position: {
        x: clipboard.position.x + 40,
        y: clipboard.position.y + 40,
      },
    };
    get().addNode(newNode);
    set({ selectedNodeId: newNode.id });
  },

  selectAll: () => {
    const { nodes } = get();
    if (nodes.length > 0) {
      set({ selectedNodeId: nodes[0].id });
    }
  },

  clear: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
    });
    get().pushHistory();
  },

  pushHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    if (newHistory.length > 50) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      set({
        nodes: JSON.parse(JSON.stringify(prev.nodes)),
        edges: JSON.parse(JSON.stringify(prev.edges)),
        historyIndex: historyIndex - 1,
        selectedNodeId: null,
        selectedEdgeId: null,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      set({
        nodes: JSON.parse(JSON.stringify(next.nodes)),
        edges: JSON.parse(JSON.stringify(next.edges)),
        historyIndex: historyIndex + 1,
        selectedNodeId: null,
        selectedEdgeId: null,
      });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
