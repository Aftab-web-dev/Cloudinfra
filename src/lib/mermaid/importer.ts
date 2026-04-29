import type {
  CanvasNode,
  CanvasEdge,
  CloudNodeData,
  GroupNodeData,
} from '../../types';
import { parseMermaid } from './parser';
import { mapMermaidNode } from './mapper';
import { computeLayout, NODE_WIDTH, NODE_HEIGHT } from './layout';
import { getEdgeStyle, EDGE_COLORS } from '../../utils/edgeStyle';
import { MarkerType } from '@xyflow/react';

export type DirectionOption = 'auto' | 'TB' | 'LR';

export interface ImportOptions {
  idPrefix?: string;
  direction?: DirectionOption;
}

export interface ImportStats {
  totalNodes: number;
  totalEdges: number;
  totalSubgraphs: number;
  exactMatches: number;
  keywordMatches: number;
  fallbacks: number;
}

export interface ImportResult {
  ok: boolean;
  errors: string[];
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  stats: ImportStats;
}

const SUBGRAPH_PADDING = 30;
const SUBGRAPH_HEADER = 40;

export function previewMermaid(source: string, opts?: ImportOptions): ImportResult {
  return importMermaid(source, { idPrefix: 'preview', ...opts });
}

export function importMermaid(source: string, opts?: ImportOptions): ImportResult {
  const prefix = opts?.idPrefix ?? `mm-${Date.now()}`;
  const { ast, errors: parseErrors } = parseMermaid(source);
  const errors = parseErrors.map((e) => `Line ${e.line}: ${e.message}`);
  if (ast && opts?.direction && opts.direction !== 'auto') {
    ast.direction = opts.direction;
  }

  const stats: ImportStats = {
    totalNodes: 0,
    totalEdges: 0,
    totalSubgraphs: 0,
    exactMatches: 0,
    keywordMatches: 0,
    fallbacks: 0,
  };

  if (!ast || ast.nodes.length === 0) {
    return { ok: false, errors, nodes: [], edges: [], stats };
  }

  const positions = computeLayout(ast);
  stats.totalNodes = ast.nodes.length;
  stats.totalEdges = ast.edges.length;
  stats.totalSubgraphs = ast.subgraphs.length;

  const cloudNodes: CanvasNode[] = ast.nodes.map((n) => {
    const map = mapMermaidNode(n);
    if (map.matchType === 'exact') stats.exactMatches++;
    else if (map.matchType === 'keyword') stats.keywordMatches++;
    else stats.fallbacks++;

    const pos = positions.get(n.id) ?? { x: 0, y: 0 };
    const node: CanvasNode = {
      id: `${prefix}-${n.id}`,
      type: 'cloudNode',
      position: pos,
      data: {
        component: map.component,
        label: n.label,
        notes: '',
        config: {},
      } satisfies CloudNodeData,
    } as CanvasNode;
    return node;
  });

  const groupNodes: CanvasNode[] = ast.subgraphs
    .map((sg) => {
      const memberIds = ast.nodes.filter((n) => n.parentId === sg.id).map((n) => n.id);
      const memberPositions = memberIds
        .map((id) => positions.get(id))
        .filter((p): p is { x: number; y: number } => Boolean(p));
      if (memberPositions.length === 0) return null;
      const minX = Math.min(...memberPositions.map((p) => p.x)) - SUBGRAPH_PADDING;
      const minY = Math.min(...memberPositions.map((p) => p.y)) - SUBGRAPH_PADDING - SUBGRAPH_HEADER;
      const maxX = Math.max(...memberPositions.map((p) => p.x)) + NODE_WIDTH + SUBGRAPH_PADDING;
      const maxY = Math.max(...memberPositions.map((p) => p.y)) + NODE_HEIGHT + SUBGRAPH_PADDING;
      return {
        id: `${prefix}-sg-${sg.id}`,
        type: 'groupNode',
        position: { x: minX, y: minY },
        data: {
          label: sg.label,
          color: '#8b5cf6',
          icon: 'Network',
          provider: 'generic',
        } satisfies GroupNodeData,
        style: {
          width: maxX - minX,
          height: maxY - minY,
          zIndex: -1,
        },
        zIndex: -1,
      } as CanvasNode;
    })
    .filter((n): n is CanvasNode => n !== null);

  const canvasEdges: CanvasEdge[] = ast.edges.map((e, i) => {
    const sourceId = `${prefix}-${e.source}`;
    const targetId = `${prefix}-${e.target}`;
    // dotted in mermaid often = async — color it amber if no explicit label
    const styleProps =
      e.style === 'dotted' && !e.label
        ? {
            style: { stroke: EDGE_COLORS.queue, strokeWidth: 2.5, strokeLinecap: 'round' as const },
            markerStart: { type: MarkerType.ArrowClosed, color: EDGE_COLORS.queue, width: 16, height: 16 },
            markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_COLORS.queue, width: 16, height: 16 },
            labelStyle: { fill: EDGE_COLORS.queue, fontWeight: 600, fontSize: 10 },
            labelBgStyle: { fill: 'white', fillOpacity: 0.85 },
          }
        : getEdgeStyle(e.label, { thick: e.style === 'thick' });
    return {
      id: `${prefix}-edge-${i}`,
      source: sourceId,
      target: targetId,
      type: 'smoothstep',
      animated: true,
      label: e.label,
      data: { protocol: e.label || '', description: '' },
      ...styleProps,
    } as CanvasEdge;
  });

  return {
    ok: true,
    errors,
    nodes: [...groupNodes, ...cloudNodes],
    edges: canvasEdges,
    stats,
  };
}
