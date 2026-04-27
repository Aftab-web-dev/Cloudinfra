import dagre from 'dagre';
import type { MermaidAST, MermaidDirection } from './parser';

export interface LayoutPosition {
  x: number;
  y: number;
}

export const NODE_WIDTH = 170;
export const NODE_HEIGHT = 80;

function toRankdir(direction: MermaidDirection): string {
  if (direction === 'TD') return 'TB';
  return direction;
}

export function computeLayout(ast: MermaidAST): Map<string, LayoutPosition> {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: toRankdir(ast.direction),
    nodesep: 60,
    ranksep: 90,
    marginx: 20,
    marginy: 20,
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const node of ast.nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of ast.edges) {
    if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  }

  dagre.layout(g);

  const positions = new Map<string, LayoutPosition>();
  for (const id of g.nodes()) {
    const n = g.node(id);
    if (n) {
      positions.set(id, {
        x: n.x - NODE_WIDTH / 2,
        y: n.y - NODE_HEIGHT / 2,
      });
    }
  }
  return positions;
}
