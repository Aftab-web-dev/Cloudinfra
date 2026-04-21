import { create } from 'zustand';
import { useCanvasStore } from './canvasStore';

export type NodeHealth = 'healthy' | 'degraded' | 'down';

export interface NodeStatus {
  health: NodeHealth;
  latencyMs: number;
  requestCount: number;
  errorCount: number;
  lastRequestTime: number | null;
}

export interface TrafficPacket {
  id: string;
  edgeId: string;
  sourceId: string;
  targetId: string;
  progress: number; // 0-1
  speed: number;
  color: string;
  label?: string;
  status: 'in-flight' | 'delivered' | 'failed';
}

export interface RequestLog {
  id: string;
  timestamp: number;
  path: string[];
  latencyMs: number;
  status: 'success' | 'failed' | 'in-progress';
  failedAt?: string;
}

// Estimated latency by component category
const LATENCY_MAP: Record<string, [number, number]> = {
  // [min, max] in ms
  'Compute': [5, 30],
  'Database': [10, 80],
  'Storage': [15, 100],
  'Networking': [1, 10],
  'Messaging': [5, 50],
  'Security': [2, 15],
  'Monitoring': [1, 5],
  'AI & ML': [50, 500],
  'Clients': [0, 0],
  'External': [30, 200],
  'DevOps': [5, 20],
  'Infrastructure Groups': [0, 0],
};

function estimateLatency(category: string): number {
  const [min, max] = LATENCY_MAP[category] || [5, 30];
  return min + Math.floor(Math.random() * (max - min));
}

interface SimulationState {
  // Mode
  active: boolean;
  running: boolean;

  // Node states
  nodeStatuses: Record<string, NodeStatus>;

  // Traffic
  packets: TrafficPacket[];
  requestLogs: RequestLog[];

  // Auto-traffic
  autoTrafficInterval: ReturnType<typeof setInterval> | null;
  requestsPerSecond: number;

  // Actions
  toggleSimulation: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  sendRequest: (startNodeId?: string) => void;
  toggleNodeHealth: (nodeId: string) => void;
  setNodeHealth: (nodeId: string, health: NodeHealth) => void;
  updatePackets: () => void;
  startAutoTraffic: (rps: number) => void;
  stopAutoTraffic: () => void;
  setRequestsPerSecond: (rps: number) => void;
  reset: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  active: false,
  running: false,
  nodeStatuses: {},
  packets: [],
  requestLogs: [],
  autoTrafficInterval: null,
  requestsPerSecond: 1,

  toggleSimulation: () => {
    const { active } = get();
    if (active) {
      get().stopSimulation();
    } else {
      get().startSimulation();
    }
  },

  startSimulation: () => {
    const { nodes } = useCanvasStore.getState();
    const statuses: Record<string, NodeStatus> = {};
    for (const node of nodes) {
      statuses[node.id] = {
        health: 'healthy',
        latencyMs: 0,
        requestCount: 0,
        errorCount: 0,
        lastRequestTime: null,
      };
    }
    set({ active: true, running: true, nodeStatuses: statuses, packets: [], requestLogs: [] });
  },

  stopSimulation: () => {
    get().stopAutoTraffic();
    set({ active: false, running: false, packets: [], requestLogs: [] });
  },

  sendRequest: (startNodeId?: string) => {
    const { nodes, edges } = useCanvasStore.getState();
    const { nodeStatuses } = get();

    // Find start node — either specified or first client/browser node
    let startId = startNodeId;
    if (!startId) {
      const clientNode = nodes.find((n) => {
        const data = n.data as Record<string, unknown>;
        const comp = data?.component as Record<string, string> | undefined;
        return comp?.category === 'Clients' || comp?.type?.includes('browser') || comp?.type?.includes('client');
      });
      if (!clientNode) {
        // Just pick first node with outgoing edges
        const sourcesSet = new Set(edges.map((e) => e.source));
        const firstSource = nodes.find((n) => sourcesSet.has(n.id));
        startId = firstSource?.id || nodes[0]?.id;
      } else {
        startId = clientNode.id;
      }
    }
    if (!startId) return;

    // BFS to find path from start
    const adj = new Map<string, { target: string; edgeId: string }[]>();
    for (const e of edges) {
      if (!adj.has(e.source)) adj.set(e.source, []);
      adj.get(e.source)!.push({ target: e.target, edgeId: e.id });
    }

    const visited = new Set<string>();
    const queue: string[] = [startId];
    const parent = new Map<string, { nodeId: string; edgeId: string }>();
    visited.add(startId);

    // BFS
    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = adj.get(current) || [];
      for (const { target, edgeId } of neighbors) {
        if (!visited.has(target)) {
          visited.add(target);
          parent.set(target, { nodeId: current, edgeId });
          queue.push(target);
        }
      }
    }

    // Build ordered traversal path using DFS from start
    const orderedPath: { nodeId: string; edgeId: string }[] = [];
    const dfsVisited = new Set<string>();

    function dfs(nodeId: string) {
      dfsVisited.add(nodeId);
      const neighbors = adj.get(nodeId) || [];
      for (const { target, edgeId } of neighbors) {
        if (!dfsVisited.has(target)) {
          orderedPath.push({ nodeId: target, edgeId });
          dfs(target);
        }
      }
    }
    dfs(startId);

    if (orderedPath.length === 0) return;

    // Create packets with staggered timing
    const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newPackets: TrafficPacket[] = [];
    let totalLatency = 0;
    const pathNodeIds = [startId];
    let failed = false;
    let failedAt: string | undefined;

    for (let i = 0; i < orderedPath.length; i++) {
      const { nodeId, edgeId } = orderedPath[i];
      const nodeStatus = nodeStatuses[nodeId];
      pathNodeIds.push(nodeId);

      if (nodeStatus?.health === 'down') {
        failed = true;
        failedAt = nodeId;
        // Create packet that will fail
        newPackets.push({
          id: `pkt-${requestId}-${i}`,
          edgeId,
          sourceId: i === 0 ? startId : orderedPath[i - 1].nodeId,
          targetId: nodeId,
          progress: 0,
          speed: 0.02 + Math.random() * 0.01,
          color: '#ef4444',
          label: 'FAIL',
          status: 'in-flight',
        });
        break;
      }

      const node = nodes.find((n) => n.id === nodeId);
      const data = node?.data as Record<string, unknown>;
      const comp = data?.component as Record<string, string> | undefined;
      const category = comp?.category || 'Compute';
      const latency = nodeStatus?.health === 'degraded'
        ? estimateLatency(category) * 3
        : estimateLatency(category);
      totalLatency += latency;

      // Update node status
      set((state) => ({
        nodeStatuses: {
          ...state.nodeStatuses,
          [nodeId]: {
            ...state.nodeStatuses[nodeId],
            latencyMs: latency,
            requestCount: (state.nodeStatuses[nodeId]?.requestCount || 0) + 1,
            lastRequestTime: Date.now(),
          },
        },
      }));

      const isSlowed = nodeStatus?.health === 'degraded';
      newPackets.push({
        id: `pkt-${requestId}-${i}`,
        edgeId,
        sourceId: i === 0 ? startId : orderedPath[i - 1].nodeId,
        targetId: nodeId,
        progress: -i * 0.3, // Stagger start
        speed: isSlowed ? 0.008 : (0.015 + Math.random() * 0.01),
        color: isSlowed ? '#f59e0b' : '#22c55e',
        status: 'in-flight',
      });
    }

    // Update start node count
    set((state) => ({
      nodeStatuses: {
        ...state.nodeStatuses,
        [startId]: {
          ...state.nodeStatuses[startId],
          requestCount: (state.nodeStatuses[startId]?.requestCount || 0) + 1,
          lastRequestTime: Date.now(),
        },
      },
    }));

    // Add packets
    set((state) => ({
      packets: [...state.packets, ...newPackets],
    }));

    // Add to request log
    const log: RequestLog = {
      id: requestId,
      timestamp: Date.now(),
      path: pathNodeIds,
      latencyMs: totalLatency,
      status: failed ? 'failed' : 'in-progress',
      failedAt,
    };

    set((state) => ({
      requestLogs: [log, ...state.requestLogs].slice(0, 50),
    }));

    // Mark as success after packets finish traveling
    if (!failed) {
      setTimeout(() => {
        set((state) => ({
          requestLogs: state.requestLogs.map((r) =>
            r.id === requestId ? { ...r, status: 'success' as const } : r
          ),
        }));
      }, orderedPath.length * 800 + 500);
    }
  },

  toggleNodeHealth: (nodeId) => {
    const { nodeStatuses } = get();
    const current = nodeStatuses[nodeId]?.health || 'healthy';
    const next: NodeHealth =
      current === 'healthy' ? 'degraded' : current === 'degraded' ? 'down' : 'healthy';
    set((state) => ({
      nodeStatuses: {
        ...state.nodeStatuses,
        [nodeId]: { ...state.nodeStatuses[nodeId], health: next },
      },
    }));
  },

  setNodeHealth: (nodeId, health) => {
    set((state) => ({
      nodeStatuses: {
        ...state.nodeStatuses,
        [nodeId]: { ...state.nodeStatuses[nodeId], health },
      },
    }));
  },

  updatePackets: () => {
    set((state) => {
      const updated = state.packets
        .map((p) => ({
          ...p,
          progress: p.progress + p.speed,
        }))
        .map((p) => ({
          ...p,
          status: p.progress >= 1 ? ('delivered' as const) : p.status,
        }))
        .filter((p) => p.progress < 1.3); // Remove after slightly past end

      return { packets: updated };
    });
  },

  startAutoTraffic: (rps) => {
    get().stopAutoTraffic();
    const interval = setInterval(() => {
      if (get().running) {
        get().sendRequest();
      }
    }, 1000 / rps);
    set({ autoTrafficInterval: interval, requestsPerSecond: rps });
  },

  stopAutoTraffic: () => {
    const { autoTrafficInterval } = get();
    if (autoTrafficInterval) {
      clearInterval(autoTrafficInterval);
      set({ autoTrafficInterval: null });
    }
  },

  setRequestsPerSecond: (rps) => {
    set({ requestsPerSecond: rps });
    const { autoTrafficInterval } = get();
    if (autoTrafficInterval) {
      get().startAutoTraffic(rps);
    }
  },

  reset: () => {
    get().stopAutoTraffic();
    set({
      packets: [],
      requestLogs: [],
      nodeStatuses: Object.fromEntries(
        Object.entries(get().nodeStatuses).map(([id]) => [
          id,
          { health: 'healthy' as const, latencyMs: 0, requestCount: 0, errorCount: 0, lastRequestTime: null },
        ])
      ),
    });
  },
}));
