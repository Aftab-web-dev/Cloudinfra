import type { CanvasNode, CanvasEdge } from '../types';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 70;
const H_GAP = 60;
const V_GAP = 100;

export function autoLayoutHierarchical(
  nodes: CanvasNode[],
  edges: CanvasEdge[]
): CanvasNode[] {
  if (nodes.length === 0) return nodes;

  // Skip group nodes from layout
  const layoutNodes = nodes.filter((n) => n.type !== 'groupNode');
  const groupNodes = nodes.filter((n) => n.type === 'groupNode');

  // Build adjacency
  const children = new Map<string, string[]>();
  const parents = new Map<string, string[]>();
  for (const n of layoutNodes) {
    children.set(n.id, []);
    parents.set(n.id, []);
  }
  for (const e of edges) {
    children.get(e.source)?.push(e.target);
    parents.get(e.target)?.push(e.source);
  }

  // Find roots (no parents among layout nodes)
  const layoutIds = new Set(layoutNodes.map((n) => n.id));
  const roots = layoutNodes.filter((n) => {
    const p = parents.get(n.id) || [];
    return p.filter((pid) => layoutIds.has(pid)).length === 0;
  });

  if (roots.length === 0) {
    // Fallback: grid layout
    return gridLayout(nodes);
  }

  // BFS to assign levels
  const levels = new Map<string, number>();
  const queue: { id: string; level: number }[] = roots.map((r) => ({ id: r.id, level: 0 }));
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    levels.set(id, Math.max(levels.get(id) || 0, level));

    for (const child of children.get(id) || []) {
      if (!visited.has(child) && layoutIds.has(child)) {
        queue.push({ id: child, level: level + 1 });
      }
    }
  }

  // Assign unvisited nodes
  for (const n of layoutNodes) {
    if (!levels.has(n.id)) {
      levels.set(n.id, 0);
    }
  }

  // Group by level
  const byLevel = new Map<number, string[]>();
  for (const [id, level] of levels) {
    if (!byLevel.has(level)) byLevel.set(level, []);
    byLevel.get(level)!.push(id);
  }

  // Position nodes
  const maxLevel = Math.max(...byLevel.keys());
  const positions = new Map<string, { x: number; y: number }>();

  for (let level = 0; level <= maxLevel; level++) {
    const nodesAtLevel = byLevel.get(level) || [];
    const totalWidth = nodesAtLevel.length * NODE_WIDTH + (nodesAtLevel.length - 1) * H_GAP;
    const startX = -totalWidth / 2;

    nodesAtLevel.forEach((id, i) => {
      positions.set(id, {
        x: startX + i * (NODE_WIDTH + H_GAP) + 400,
        y: level * (NODE_HEIGHT + V_GAP) + 50,
      });
    });
  }

  return nodes.map((n) => {
    const pos = positions.get(n.id);
    if (pos) return { ...n, position: pos };
    return n;
  }).concat(
    groupNodes.filter((g) => !nodes.some((n) => n.id === g.id))
  );
}

function gridLayout(nodes: CanvasNode[]): CanvasNode[] {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  return nodes.map((n, i) => ({
    ...n,
    position: {
      x: (i % cols) * (NODE_WIDTH + H_GAP) + 50,
      y: Math.floor(i / cols) * (NODE_HEIGHT + V_GAP) + 50,
    },
  }));
}
