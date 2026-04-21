import { useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useSimulationStore } from '../../store/simulationStore';

export function TrafficAnimator() {
  const { active, packets, updatePackets } = useSimulationStore();
  const { getEdges, getNodes } = useReactFlow();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Animation loop for packet movement
  useEffect(() => {
    if (!active) return;

    const tick = () => {
      updatePackets();
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [active, updatePackets]);

  // Render packets as overlay dots
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
      const sx = (sourceNode.position.x + (sourceNode.measured?.width || 140) / 2);
      const sy = (sourceNode.position.y + (sourceNode.measured?.height || 50));
      const tx = (targetNode.position.x + (targetNode.measured?.width || 140) / 2);
      const ty = (targetNode.position.y);

      const x = sx + (tx - sx) * packet.progress;
      const y = sy + (ty - sy) * packet.progress;

      // Draw glow
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = `${packet.color}30`;
      ctx.fill();

      // Draw dot
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = packet.color;
      ctx.fill();

      // Trail
      for (let t = 1; t <= 3; t++) {
        const tp = packet.progress - t * 0.04;
        if (tp < 0) break;
        const trailX = sx + (tx - sx) * tp;
        const trailY = sy + (ty - sy) * tp;
        ctx.beginPath();
        ctx.arc(trailX, trailY, 3 - t * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `${packet.color}${Math.round((1 - t * 0.3) * 60).toString(16).padStart(2, '0')}`;
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
