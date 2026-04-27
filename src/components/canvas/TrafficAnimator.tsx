import { useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useSimulationStore } from '../../store/simulationStore';

export function TrafficAnimator() {
  const { active, packets, updatePackets } = useSimulationStore();
  const { getEdges, getNodes } = useReactFlow();
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

  // Render packets as overlay
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const edges = getEdges();
    const nodes = getNodes();

    for (const packet of packets) {
      if (packet.progress < 0 || packet.progress > 1) continue;

      const edge = edges.find((e) => e.id === packet.edgeId);
      if (!edge) continue;

      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode) continue;

      // Interpolate position
      const sx = (sourceNode.position.x + (sourceNode.measured?.width || 170) / 2);
      const sy = (sourceNode.position.y + (sourceNode.measured?.height || 80));
      const tx = (targetNode.position.x + (targetNode.measured?.width || 170) / 2);
      const ty = (targetNode.position.y);

      // Smooth curved path (bezier)
      const midY = (sy + ty) / 2;
      const t = packet.progress;
      const t2 = t * t;
      const t3 = t2 * t;
      const mt = 1 - t;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;

      // Cubic bezier: start -> mid control -> mid control -> end
      const x = mt3 * sx + 3 * mt2 * t * sx + 3 * mt * t2 * tx + t3 * tx;
      const y = mt3 * sy + 3 * mt2 * t * midY + 3 * mt * t2 * midY + t3 * ty;

      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 14);
      gradient.addColorStop(0, `${packet.color}50`);
      gradient.addColorStop(0.5, `${packet.color}20`);
      gradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner glow
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = `${packet.color}60`;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = packet.color;
      ctx.fill();

      // Add bright center
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Trail (longer, fading)
      for (let i = 1; i <= 5; i++) {
        const tp = packet.progress - i * 0.03;
        if (tp < 0) break;
        const tt = tp;
        const tt2 = tt * tt;
        const tt3 = tt2 * tt;
        const mtt = 1 - tt;
        const mtt2 = mtt * mtt;
        const mtt3 = mtt2 * mtt;

        const trailX = mtt3 * sx + 3 * mtt2 * tt * sx + 3 * mtt * tt2 * tx + tt3 * tx;
        const trailY = mtt3 * sy + 3 * mtt2 * tt * midY + 3 * mtt * tt2 * midY + tt3 * ty;

        const alpha = (1 - i * 0.18);
        const radius = 3 - i * 0.4;
        if (radius <= 0) break;

        ctx.beginPath();
        ctx.arc(trailX, trailY, radius, 0, Math.PI * 2);
        ctx.fillStyle = packet.color;
        ctx.globalAlpha = alpha * 0.5;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Draw active connection pulses when no packets (visual heartbeat)
    if (packets.length === 0) {
      const time = timeRef.current;
      for (const edge of edges) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) continue;

        const sx = (sourceNode.position.x + (sourceNode.measured?.width || 170) / 2);
        const sy = (sourceNode.position.y + (sourceNode.measured?.height || 80));
        const tx = (targetNode.position.x + (targetNode.measured?.width || 170) / 2);
        const ty = (targetNode.position.y);

        // Subtle pulse along edge
        const pulse = (Math.sin(time * 2 + edges.indexOf(edge) * 0.5) + 1) / 2;
        const midX = (sx + tx) / 2;
        const midY = (sy + ty) / 2;

        ctx.beginPath();
        ctx.arc(midX, midY, 2 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${pulse * 0.15})`;
        ctx.fill();
      }
    }
  });

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}
