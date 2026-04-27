// Hand-rolled parser for the Mermaid flowchart subset.
// Supports: flowchart/graph + direction, node shapes, edge variants,
// edge chains, |labels|, subgraph blocks, comments. Ignores style/class/click.

export type MermaidDirection = 'TB' | 'TD' | 'BT' | 'LR' | 'RL';

export type MermaidNodeShape =
  | 'rect'
  | 'rounded'
  | 'circle'
  | 'rhombus'
  | 'asymmetric'
  | 'parallelogram'
  | 'cylinder'
  | 'hexagon';

export interface MermaidNode {
  id: string;
  label: string;
  shape: MermaidNodeShape;
  parentId?: string;
}

export type MermaidEdgeStyle = 'solid' | 'dotted' | 'thick';

export interface MermaidEdge {
  source: string;
  target: string;
  label?: string;
  style: MermaidEdgeStyle;
  arrow: boolean;
}

export interface MermaidSubgraph {
  id: string;
  label: string;
  parentId?: string;
}

export interface MermaidAST {
  direction: MermaidDirection;
  nodes: MermaidNode[];
  edges: MermaidEdge[];
  subgraphs: MermaidSubgraph[];
}

export interface ParseError {
  line: number;
  message: string;
}

export interface ParseResult {
  ast: MermaidAST | null;
  errors: ParseError[];
}

const EDGE_SPLIT_RE =
  /(\s*(?:-{2,3}>|-{3,}|-\.->|-\.-|={2,3}>|={3,})(?:\|[^|]+\|)?\s*)/;
const EDGE_TEST_RE =
  /(?:-{2,3}>|-{3,}|-\.->|-\.-|={2,3}>|={3,})/;

export function parseMermaid(source: string): ParseResult {
  const errors: ParseError[] = [];
  const ast: MermaidAST = {
    direction: 'LR',
    nodes: [],
    edges: [],
    subgraphs: [],
  };
  const nodeMap = new Map<string, MermaidNode>();
  const subgraphStack: string[] = [];
  let foundHeader = false;
  let subgraphCounter = 0;

  const cleaned = stripComments(source);
  const lines = cleaned.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const raw = lines[i];
    const statements = raw.split(/;+/).map((s) => s.trim()).filter(Boolean);

    for (const stmt of statements) {
      if (!stmt) continue;

      const headerMatch = stmt.match(/^(?:flowchart|graph)\s+(TD|TB|BT|LR|RL)\s*$/i);
      if (headerMatch) {
        if (!foundHeader) {
          ast.direction = headerMatch[1].toUpperCase() as MermaidDirection;
          foundHeader = true;
        }
        continue;
      }
      if (/^(?:flowchart|graph)\s*$/i.test(stmt)) {
        foundHeader = true;
        continue;
      }

      const subgraphMatch = stmt.match(/^subgraph\s+(.+)$/i);
      if (subgraphMatch) {
        const decl = subgraphMatch[1].trim();
        const idTitleMatch = decl.match(/^([A-Za-z_][\w-]*)\s*\[(.+?)\]$/);
        const idQuotedMatch = decl.match(/^([A-Za-z_][\w-]*)\s*\["?(.+?)"?\]$/);
        const quotedOnlyMatch = decl.match(/^"(.+)"$/);
        let id: string;
        let label: string;
        if (idQuotedMatch) {
          id = idQuotedMatch[1];
          label = idQuotedMatch[2];
        } else if (idTitleMatch) {
          id = idTitleMatch[1];
          label = idTitleMatch[2];
        } else if (quotedOnlyMatch) {
          id = `__sg_${subgraphCounter++}`;
          label = quotedOnlyMatch[1];
        } else {
          id = decl;
          label = decl;
        }
        const parentId = subgraphStack[subgraphStack.length - 1];
        ast.subgraphs.push({ id, label, parentId });
        subgraphStack.push(id);
        continue;
      }

      if (/^end$/i.test(stmt)) {
        subgraphStack.pop();
        continue;
      }

      if (/^(?:style|classDef|class|click|linkStyle|direction)\b/i.test(stmt)) {
        continue;
      }

      const currentParent = subgraphStack[subgraphStack.length - 1];

      if (EDGE_TEST_RE.test(stmt)) {
        const parts = stmt.split(EDGE_SPLIT_RE);
        let consumedAny = false;
        for (let p = 0; p < parts.length - 2; p += 2) {
          const sourceRef = parseNodeRef(parts[p]);
          const edgeToken = parts[p + 1];
          const targetRef = parseNodeRef(parts[p + 2]);
          if (!sourceRef || !targetRef) continue;
          ensureNode(sourceRef, nodeMap, ast.nodes, currentParent);
          ensureNode(targetRef, nodeMap, ast.nodes, currentParent);
          const edge = parseEdgeToken(edgeToken, sourceRef.id, targetRef.id);
          if (edge) ast.edges.push(edge);
          consumedAny = true;
        }
        if (!consumedAny) {
          errors.push({ line: lineNum, message: `Could not parse edge: ${stmt.slice(0, 60)}` });
        }
      } else {
        const ref = parseNodeRef(stmt);
        if (ref) {
          ensureNode(ref, nodeMap, ast.nodes, currentParent);
        } else {
          errors.push({ line: lineNum, message: `Unrecognized statement: ${stmt.slice(0, 60)}` });
        }
      }
    }
  }

  if (ast.nodes.length === 0 && errors.length === 0) {
    errors.push({ line: 1, message: 'No nodes found in source' });
  }

  return { ast: ast.nodes.length > 0 ? ast : null, errors };
}

interface NodeRef {
  id: string;
  label: string;
  shape: MermaidNodeShape;
}

function parseNodeRef(text: string): NodeRef | null {
  const t = text.trim();
  if (!t) return null;

  const patterns: [RegExp, MermaidNodeShape][] = [
    [/^([A-Za-z_][\w-]*)\(\((.+?)\)\)$/, 'circle'],
    [/^([A-Za-z_][\w-]*)\{\{(.+?)\}\}$/, 'hexagon'],
    [/^([A-Za-z_][\w-]*)\[\((.+?)\)\]$/, 'cylinder'],
    [/^([A-Za-z_][\w-]*)\[\/(.+?)\/\]$/, 'parallelogram'],
    [/^([A-Za-z_][\w-]*)\[\\(.+?)\\\]$/, 'parallelogram'],
    [/^([A-Za-z_][\w-]*)\[(.+?)\]$/, 'rect'],
    [/^([A-Za-z_][\w-]*)\((.+?)\)$/, 'rounded'],
    [/^([A-Za-z_][\w-]*)\{(.+?)\}$/, 'rhombus'],
    [/^([A-Za-z_][\w-]*)>(.+?)\]$/, 'asymmetric'],
  ];

  for (const [re, shape] of patterns) {
    const m = t.match(re);
    if (m) {
      return { id: m[1], label: stripQuotes(m[2]).trim(), shape };
    }
  }

  const idMatch = t.match(/^([A-Za-z_][\w-]*)$/);
  if (idMatch) {
    return { id: idMatch[1], label: idMatch[1], shape: 'rect' };
  }
  return null;
}

function stripQuotes(s: string): string {
  return s.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
}

function ensureNode(
  ref: NodeRef,
  nodeMap: Map<string, MermaidNode>,
  nodes: MermaidNode[],
  parentId: string | undefined,
): void {
  const existing = nodeMap.get(ref.id);
  if (existing) {
    if (existing.label === existing.id && ref.label !== ref.id) {
      existing.label = ref.label;
      existing.shape = ref.shape;
    }
    if (parentId && !existing.parentId) {
      existing.parentId = parentId;
    }
    return;
  }
  const node: MermaidNode = {
    id: ref.id,
    label: ref.label,
    shape: ref.shape,
  };
  if (parentId) node.parentId = parentId;
  nodeMap.set(ref.id, node);
  nodes.push(node);
}

function parseEdgeToken(raw: string, source: string, target: string): MermaidEdge {
  const t = raw.trim();
  let label: string | undefined;
  const labelMatch = t.match(/\|([^|]+)\|/);
  if (labelMatch) {
    label = labelMatch[1].trim();
  }
  const arrowToken = t.replace(/\|[^|]+\|/, '').trim();
  let style: MermaidEdgeStyle = 'solid';
  if (arrowToken.includes('-.')) style = 'dotted';
  else if (arrowToken.includes('==')) style = 'thick';
  const arrow = arrowToken.endsWith('>');
  return { source, target, label, style, arrow };
}

function stripComments(s: string): string {
  return s.replace(/%%.*$/gm, '');
}
