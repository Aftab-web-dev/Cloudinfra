import type { Node, Edge } from '@xyflow/react';

export type CloudProvider = 'aws' | 'azure' | 'gcp' | 'alibaba' | 'generic';

export interface CloudComponent {
  id: string;
  type: string;
  provider: CloudProvider;
  category: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface CloudNodeData {
  component: CloudComponent;
  label: string;
  notes: string;
  config: Record<string, string>;
  [key: string]: unknown;
}

export interface GroupNodeData {
  label: string;
  color: string;
  icon: string;
  provider: CloudProvider;
  subtitle?: string;
  component?: CloudComponent;
  [key: string]: unknown;
}

export type CloudNode = Node<CloudNodeData, 'cloudNode'>;
export type GroupCanvasNode = Node<GroupNodeData, 'groupNode'>;
export type CanvasNode = CloudNode | GroupCanvasNode;

export interface CanvasEdgeData {
  protocol?: string;
  description?: string;
  [key: string]: unknown;
}

export type CanvasEdge = Edge<CanvasEdgeData>;

export interface Diagram {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: { x: number; y: number; zoom: number };
  createdAt: string;
  updatedAt: string;
  template?: string;
}

export interface ComponentCategory {
  name: string;
  components: CloudComponent[];
}

export interface ProviderLibrary {
  provider: CloudProvider;
  label: string;
  color: string;
  categories: ComponentCategory[];
}

export interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  pattern: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}
