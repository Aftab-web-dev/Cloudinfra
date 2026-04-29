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
  // compound: true makes dagre treat parent/child relationships as clusters,
  // so members of different subgraphs don't interleave on the same rank
  // and the subgraph bounding boxes won't overlap.
  const g = new dagre.graphlib.Graph({ compound: true });
  g.setGraph({
    rankdir: toRankdir(ast.direction),
    nodesep: 70,
    ranksep: 110,
    marginx: 24,
    marginy: 24,
    ranker: 'tight-tree',
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Register subgraphs as cluster nodes (no width/height — dagre sizes them
  // from their children when compound mode is enabled).
  for (const sg of ast.subgraphs) {
    g.setNode(sg.id, { label: sg.label });
  }
  for (const sg of ast.subgraphs) {
    if (sg.parentId) g.setParent(sg.id, sg.parentId);
  }

  for (const node of ast.nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    if (node.parentId) g.setParent(node.id, node.parentId);
  }
  for (const edge of ast.edges) {
    if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  }

  dagre.layout(g);

  const subgraphIds = new Set(ast.subgraphs.map((sg) => sg.id));
  const positions = new Map<string, LayoutPosition>();
  for (const id of g.nodes()) {
    if (subgraphIds.has(id)) continue;
    const n = g.node(id);
    if (n && typeof n.x === 'number' && typeof n.y === 'number') {
      positions.set(id, {
        x: n.x - NODE_WIDTH / 2,
        y: n.y - NODE_HEIGHT / 2,
      });
    }
  }
  return positions;
}
