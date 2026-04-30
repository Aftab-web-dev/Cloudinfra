import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as LucideIcons from 'lucide-react';
import pptxgen from 'pptxgenjs';
import type {
  CanvasEdge,
  CanvasNode,
  CloudNode,
  GroupCanvasNode,
  TextCanvasNode,
} from '../types';

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const MARGIN = 0.4;

const FALLBACK_NODE_W = 110;
const FALLBACK_NODE_H = 96;

type Theme = 'light' | 'dark';

interface MeasuredNode {
  width?: number;
  height?: number;
  measured?: { width?: number; height?: number };
}

function isCloudNode(n: CanvasNode): n is CloudNode {
  return n.type === 'cloudNode';
}
function isGroupNode(n: CanvasNode): n is GroupCanvasNode {
  return n.type === 'groupNode';
}
function isTextNode(n: CanvasNode): n is TextCanvasNode {
  return n.type === 'textNode';
}

function nodeSize(n: CanvasNode): { w: number; h: number } {
  const m = n as MeasuredNode;
  const w = m.width ?? m.measured?.width ?? FALLBACK_NODE_W;
  const h = m.height ?? m.measured?.height ?? FALLBACK_NODE_H;
  return { w, h };
}

function stripHash(c: string | undefined, fallback: string): string {
  if (!c) return fallback;
  return c.startsWith('#') ? c.slice(1) : c;
}

function utf8ToBase64(str: string): string {
  // Browser-safe UTF-8 → base64
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function iconToSvgDataUrl(iconName: string, hexColor: string, size = 48): string {
  const lib = LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>;
  const Icon = lib[iconName] || LucideIcons.Box;
  let svg = renderToStaticMarkup(
    createElement(Icon, { size, color: hexColor, strokeWidth: 1.6 }),
  );
  if (!svg.includes('xmlns=')) {
    svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  }
  return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
}

function getDiagramBounds(nodes: CanvasNode[]) {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, width: 1, height: 1 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    const { w, h } = nodeSize(n);
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + w);
    maxY = Math.max(maxY, n.position.y + h);
  }
  return {
    minX,
    minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

interface ProjectionRect {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

function buildProjection(
  nodes: CanvasNode[],
): { rects: Map<string, ProjectionRect>; scale: number } {
  const bounds = getDiagramBounds(nodes);
  const drawableW = SLIDE_W - 2 * MARGIN;
  const drawableH = SLIDE_H - 2 * MARGIN;
  const scale = Math.min(drawableW / bounds.width, drawableH / bounds.height);
  const offsetX = MARGIN + (drawableW - bounds.width * scale) / 2;
  const offsetY = MARGIN + (drawableH - bounds.height * scale) / 2;

  const rects = new Map<string, ProjectionRect>();
  for (const n of nodes) {
    const { w, h } = nodeSize(n);
    const x = offsetX + (n.position.x - bounds.minX) * scale;
    const y = offsetY + (n.position.y - bounds.minY) * scale;
    const wIn = Math.max(0.4, w * scale);
    const hIn = Math.max(0.3, h * scale);
    rects.set(n.id, { x, y, w: wIn, h: hIn, cx: x + wIn / 2, cy: y + hIn / 2 });
  }
  return { rects, scale };
}

function drawGroupNode(
  pres: pptxgen,
  slide: pptxgen.Slide,
  n: GroupCanvasNode,
  rect: ProjectionRect,
  theme: Theme,
) {
  const color = stripHash(n.data.color, '6366F1');
  slide.addShape(pres.ShapeType.roundRect, {
    x: rect.x,
    y: rect.y,
    w: rect.w,
    h: rect.h,
    fill: { color, transparency: 92 },
    line: { color, width: 1.5, dashType: 'dash' },
    rectRadius: 0.12,
  });
  if (n.data.label) {
    slide.addText(n.data.label, {
      x: rect.x + 0.1,
      y: rect.y + 0.05,
      w: Math.max(0.6, rect.w - 0.2),
      h: 0.32,
      fontSize: 11,
      bold: true,
      align: 'left',
      valign: 'top',
      color: theme === 'dark' ? 'E5E7EB' : color,
    });
  }
}

function drawCloudNode(
  pres: pptxgen,
  slide: pptxgen.Slide,
  n: CloudNode,
  rect: ProjectionRect,
  theme: Theme,
) {
  const c = n.data.component;
  const color = stripHash(c?.color, '6366F1');
  const label = (n.data.label || c?.name || 'Node').toString();
  const iconName = c?.icon || 'Box';

  slide.addShape(pres.ShapeType.roundRect, {
    x: rect.x,
    y: rect.y,
    w: rect.w,
    h: rect.h,
    fill: { color, transparency: 88 },
    line: { color, width: 1.5 },
    rectRadius: 0.08,
  });

  const iconSize = Math.min(rect.w, rect.h) * 0.45;
  const iconX = rect.x + (rect.w - iconSize) / 2;
  const iconY = rect.y + Math.max(0.08, rect.h * 0.12);
  try {
    slide.addImage({
      data: iconToSvgDataUrl(iconName, `#${color}`, 64),
      x: iconX,
      y: iconY,
      w: iconSize,
      h: iconSize,
    });
  } catch {
    // SVG embed unsupported — fall back silently to label-only
  }

  slide.addText(label, {
    x: rect.x + 0.04,
    y: iconY + iconSize + 0.02,
    w: rect.w - 0.08,
    h: Math.max(0.3, rect.h - iconSize - 0.12),
    fontSize: Math.max(9, Math.min(13, rect.w * 7)),
    bold: true,
    align: 'center',
    valign: 'top',
    color: theme === 'dark' ? 'F3F4F6' : '111827',
  });
}

function drawTextNode(
  slide: pptxgen.Slide,
  n: TextCanvasNode,
  rect: ProjectionRect,
  scale: number,
) {
  const t = n.data;
  const fontSize = Math.max(8, Math.round((t.fontSize || 14) * scale * 0.75));
  slide.addText(t.text || '', {
    x: rect.x,
    y: rect.y,
    w: rect.w,
    h: rect.h,
    fontSize,
    bold: (t.fontWeight || 400) >= 600,
    italic: !!t.italic,
    align: t.align || 'left',
    valign: 'top',
    color: stripHash(t.color, '111827'),
    fill: t.background ? { color: stripHash(t.background, 'FFFFFF') } : undefined,
  });
}

function drawEdge(
  pres: pptxgen,
  slide: pptxgen.Slide,
  e: CanvasEdge,
  source: ProjectionRect,
  target: ProjectionRect,
  theme: Theme,
  bgColor: string,
) {
  const x1 = source.cx;
  const y1 = source.cy;
  const x2 = target.cx;
  const y2 = target.cy;
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const w = Math.max(0.01, Math.abs(x2 - x1));
  const h = Math.max(0.01, Math.abs(y2 - y1));
  slide.addShape(pres.ShapeType.line, {
    x,
    y,
    w,
    h,
    line: {
      color: theme === 'dark' ? '6B7280' : '94A3B8',
      width: 1.5,
      endArrowType: 'triangle',
    },
    flipH: x2 < x1,
    flipV: y2 < y1,
  });

  const lbl = typeof e.label === 'string' ? e.label : '';
  if (lbl) {
    slide.addText(lbl, {
      x: (x1 + x2) / 2 - 0.6,
      y: (y1 + y2) / 2 - 0.13,
      w: 1.2,
      h: 0.26,
      fontSize: 9,
      align: 'center',
      valign: 'middle',
      color: theme === 'dark' ? '9CA3AF' : '64748B',
      fill: { color: bgColor },
    });
  }
}

export interface PptxExportOptions {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  theme: Theme;
  mode: 'editable' | 'image';
  /** Required for mode === 'image'. PNG data URL of the rendered diagram. */
  imageDataUrl?: string;
  fileName?: string;
}

export async function exportToPptx(opts: PptxExportOptions): Promise<void> {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'Cloud Architecture Diagram';
  pres.company = 'Cloudinfra';

  const slide = pres.addSlide();
  const bgHex = opts.theme === 'dark' ? '0A0A0F' : 'FFFFFF';
  slide.background = { color: bgHex };

  if (opts.mode === 'image') {
    if (!opts.imageDataUrl) {
      throw new Error('Image mode requires imageDataUrl');
    }
    slide.addImage({
      data: opts.imageDataUrl,
      x: 0.25,
      y: 0.25,
      w: SLIDE_W - 0.5,
      h: SLIDE_H - 0.5,
      sizing: { type: 'contain', w: SLIDE_W - 0.5, h: SLIDE_H - 0.5 },
    });
  } else {
    const { rects, scale } = buildProjection(opts.nodes);

    // Group nodes first (background layer)
    for (const n of opts.nodes) {
      if (!isGroupNode(n)) continue;
      const r = rects.get(n.id);
      if (r) drawGroupNode(pres, slide, n, r, opts.theme);
    }

    // Edges next (under cloud nodes)
    for (const e of opts.edges) {
      const a = rects.get(e.source);
      const b = rects.get(e.target);
      if (a && b) drawEdge(pres, slide, e, a, b, opts.theme, bgHex);
    }

    // Cloud + text nodes on top
    for (const n of opts.nodes) {
      const r = rects.get(n.id);
      if (!r) continue;
      if (isCloudNode(n)) drawCloudNode(pres, slide, n, r, opts.theme);
      else if (isTextNode(n)) drawTextNode(slide, n, r, scale);
    }
  }

  const fileName =
    opts.fileName ?? `cloudinfra-diagram-${Date.now()}.pptx`;
  await pres.writeFile({ fileName });
}
