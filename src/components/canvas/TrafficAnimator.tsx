import { useEffect, useRef } from 'react';
import { useReactFlow, useViewport } from '@xyflow/react';
import { useSimulationStore } from '../../store/simulationStore';

export function TrafficAnimator() {
  const { active, packets, updatePackets } = useSimulationStore();
  const { getEdges, getNodes } = useReactFlow();
  // Subscribing to viewport ensures we re-render (and redraw) on pan/zoom.
  const viewport = useViewport();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Animation loop for packet movement
  useEffect(() => {
    if (!active) return;
    const tick = () => {
      updatePackets();
      timeRef.current += 0.016;
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [active, updatePackets]);

  // Render packets — runs every render of this component (packets and viewport
  // both trigger re-renders via the store / useViewport hook).
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const container = canvas.parentElement;
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
    }
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    const edges = getEdges();
    const nodes = getNodes();

    // Apply React Flow viewport transform: graph coords -> screen coords.
    // Without this, packets render at raw graph coordinates and end up
    // off-screen as soon as the user pans/zooms (or fitView fires).
    const vx = viewport.x;
    const vy = viewport.y;
    const vz = viewport.zoom;
    const toScreen = (gx: number, gy: number) => ({
      x: gx * vz + vx,
      y: gy * vz + vy,
    });

    const nodeCenter = (n: {
      position: { x: number; y: number };
      measured?: { width?: number; height?: number };
    }) => {
      const w = n.measured?.width || 170;
      const h = n.measured?.height || 80;
      return toScreen(n.position.x + w / 2, n.position.y + h / 2);
    };

    const activeEdgeIds = new Set(
      packets.filter((p) => p.progress >= 0 && p.progress <= 1).map((p) => p.edgeId),
    );

    // Highlight edges that currently carry a packet
    for (const edge of edges) {
      if (!activeEdgeIds.has(edge.id)) continue;
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode) continue;
      const s = nodeCenter(sourceNode);
      const e = nodeCenter(targetNode);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(e.x, e.y);
      ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.35, 0.18 * vz + 0.05)})`;
      ctx.lineWidth = Math.max(2.5, 7 * vz);
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Draw packets
    for (const packet of packets) {
      if (packet.progress < 0 || packet.progress > 1) continue;
      const edge = edges.find((e) => e.id === packet.edgeId);
      if (!edge) continue;
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode) continue;

      const s = nodeCenter(sourceNode);
      const t = nodeCenter(targetNode);
      const p = packet.progress;

      // Quadratic bezier with a perpendicular bow so it reads as a curve
      // regardless of layout direction (TB or LR).
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const curveAmt = Math.min(45, len * 0.18);
      const cx = (s.x + t.x) / 2 + nx * curveAmt;
      const cy = (s.y + t.y) / 2 + ny * curveAmt;
      const mt = 1 - p;
      const x = mt * mt * s.x + 2 * mt * p * cx + p * p * t.x;
      const y = mt * mt * s.y + 2 * mt * p * cy + p * p * t.y;

      // Scale visual size with zoom but clamp so packets stay legible
      const sz = Math.max(0.7, Math.min(1.5, vz));
      const baseR = 5.5 * sz;
      const glowR = baseR * 4;

      // Outer glow
      const g = ctx.createRadialGradient(x, y, 0, x, y, glowR);
      g.addColorStop(0, `${packet.color}aa`);
      g.addColorStop(0.5, `${packet.color}33`);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Trail
      const trailSteps = 7;
      for (let i = 1; i <= trailSteps; i++) {
        const tp = p - i * 0.025;
        if (tp < 0) break;
        const mtt = 1 - tp;
        const tx2 = mtt * mtt * s.x + 2 * mtt * tp * cx + tp * tp * t.x;
        const ty2 = mtt * mtt * s.y + 2 * mtt * tp * cy + tp * tp * t.y;
        const r = baseR * (1 - i / (trailSteps + 1));
        if (r <= 0.5) break;
        const alpha = Math.round((1 - i / trailSteps) * 200)
          .toString(16)
          .padStart(2, '0');
        ctx.fillStyle = `${packet.color}${alpha}`;
        ctx.beginPath();
        ctx.arc(tx2, ty2, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Core
      ctx.beginPath();
      ctx.arc(x, y, baseR, 0, Math.PI * 2);
      ctx.fillStyle = packet.color;
      ctx.fill();
      // White hot center
      ctx.beginPath();
      ctx.arc(x, y, baseR * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // FAIL label for failed packets
      if (packet.label === 'FAIL') {
        ctx.font = `bold ${10 * sz}px ui-sans-serif, system-ui, -apple-system`;
        ctx.fillStyle = packet.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', x, y);
      }
    }

    // Idle heartbeat — tiny pulse on each connection when no packets in flight
    if (packets.length === 0) {
      const time = timeRef.current;
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) continue;
        const s = nodeCenter(sourceNode);
        const t = nodeCenter(targetNode);
        const pulse = (Math.sin(time * 2 + i * 0.5) + 1) / 2;
        const midX = (s.x + t.x) / 2;
        const midY = (s.y + t.y) / 2;
        ctx.beginPath();
        ctx.arc(midX, midY, 2 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${pulse * 0.18})`;
        ctx.fill();
      }
    }
  });

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
}
