import { create } from 'zustand';
import { useCanvasStore } from './canvasStore';
import { getServiceSpec } from '../data/serviceSpecs';
import type { CloudNodeData } from '../types';

export interface BottleneckInfo {
  nodeId: string;
  name: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestion: string;
}

export interface AvailabilityChain {
  path: string[];
  combinedSla: number;
}

export interface ArchitectureScore {
  overall: number;
  performance: number;
  reliability: number;
  security: number;
  scalability: number;
}

export interface InsightWarning {
  id: string;
  type: 'performance' | 'reliability' | 'security' | 'scalability';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  suggestion: string;
  nodeIds: string[];
}

interface InsightsState {
  bottlenecks: BottleneckInfo[];
  availabilityChains: AvailabilityChain[];
  overallAvailability: number;
  score: ArchitectureScore;
  warnings: InsightWarning[];
  endToEndLatency: { min: number; max: number };

  analyze: () => void;
}

const emptyScore: ArchitectureScore = {
  overall: 0,
  performance: 0,
  reliability: 0,
  security: 0,
  scalability: 0,
};

export const useInsightsStore = create<InsightsState>((set) => ({
  bottlenecks: [],
  availabilityChains: [],
  overallAvailability: 0,
  score: { ...emptyScore },
  warnings: [],
  endToEndLatency: { min: 0, max: 0 },

  analyze: () => {
    const { nodes, edges } = useCanvasStore.getState();
    const cloudNodes = nodes.filter((n) => n.type === 'cloudNode');

    if (cloudNodes.length === 0) {
      set({
        bottlenecks: [],
        availabilityChains: [],
        overallAvailability: 0,
        score: { ...emptyScore },
        warnings: [],
        endToEndLatency: { min: 0, max: 0 },
      });
      return;
    }

    // --- BOTTLENECK DETECTION ---
    const bottlenecks: BottleneckInfo[] = [];
    const inDegree = new Map<string, number>();
    const outDegree = new Map<string, number>();
    for (const edge of edges) {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
      outDegree.set(edge.source, (outDegree.get(edge.source) || 0) + 1);
    }

    for (const node of cloudNodes) {
      const data = node.data as unknown as CloudNodeData;
      const spec = getServiceSpec(data.component?.type || '');
      const fanIn = inDegree.get(node.id) || 0;
      const fanOut = outDegree.get(node.id) || 0;
      const name = data.label || data.component?.name || 'Unknown';

      if (fanIn >= 3 && spec.scalingType === 'manual') {
        bottlenecks.push({
          nodeId: node.id,
          name,
          reason: `High fan-in (${fanIn} connections) with manual scaling`,
          severity: 'high',
          suggestion: 'Add auto-scaling or a load balancer in front',
        });
      }
      if (fanIn >= 2 && fanOut >= 2 && !spec.multiAz) {
        bottlenecks.push({
          nodeId: node.id,
          name,
          reason: 'Single point of failure — no multi-AZ',
          severity: 'critical',
          suggestion: 'Enable multi-AZ deployment or add redundancy',
        });
      }
      if (spec.latencyMs[1] > 200 && fanIn >= 1 && fanOut >= 1) {
        bottlenecks.push({
          nodeId: node.id,
          name,
          reason: `High p99 latency (${spec.latencyMs[1]}ms) in request path`,
          severity: 'medium',
          suggestion: 'Add caching layer or async processing',
        });
      }
      if (spec.coldStartMs && spec.coldStartMs > 500 && fanIn >= 1) {
        bottlenecks.push({
          nodeId: node.id,
          name,
          reason: `Cold start risk (${spec.coldStartMs}ms)`,
          severity: 'medium',
          suggestion: 'Use provisioned concurrency or keep-warm strategy',
        });
      }
    }

    // --- AVAILABILITY CALCULATION ---
    const adj = new Map<string, string[]>();
    for (const e of edges) {
      if (!adj.has(e.source)) adj.set(e.source, []);
      adj.get(e.source)!.push(e.target);
    }

    const targetSet = new Set(edges.map((e) => e.target));
    const entryNodes = cloudNodes.filter((n) => !targetSet.has(n.id));
    const sourceSet = new Set(edges.map((e) => e.source));
    const exitNodes = cloudNodes.filter((n) => !sourceSet.has(n.id));

    const availabilityChains: AvailabilityChain[] = [];

    function findPaths(current: string, target: string, visited: Set<string>, path: string[]) {
      if (current === target) {
        let combinedSla = 1;
        for (const nodeId of path) {
          const node = cloudNodes.find((n) => n.id === nodeId);
          if (node) {
            const data = node.data as unknown as CloudNodeData;
            const spec = getServiceSpec(data.component?.type || '');
            combinedSla *= spec.sla / 100;
          }
        }
        availabilityChains.push({
          path: [...path],
          combinedSla: combinedSla * 100,
        });
        return;
      }
      const neighbors = adj.get(current) || [];
      for (const next of neighbors) {
        if (!visited.has(next)) {
          visited.add(next);
          path.push(next);
          findPaths(next, target, visited, path);
          path.pop();
          visited.delete(next);
        }
      }
    }

    for (const entry of entryNodes.slice(0, 3)) {
      for (const exit of exitNodes.slice(0, 3)) {
        if (entry.id !== exit.id) {
          const visited = new Set<string>([entry.id]);
          findPaths(entry.id, exit.id, visited, [entry.id]);
        }
      }
    }

    const overallAvailability =
      availabilityChains.length > 0
        ? Math.min(...availabilityChains.map((c) => c.combinedSla))
        : cloudNodes.length > 0
          ? cloudNodes.reduce((acc, n) => {
              const data = n.data as unknown as CloudNodeData;
              const spec = getServiceSpec(data.component?.type || '');
              return Math.min(acc, spec.sla);
            }, 100)
          : 0;

    // --- E2E LATENCY ---
    let latencyMin = 0;
    let latencyMax = 0;
    const longestChain = availabilityChains.reduce<AvailabilityChain | null>(
      (max, c) => (!max || c.path.length > max.path.length ? c : max),
      null,
    );
    if (longestChain) {
      for (const nodeId of longestChain.path) {
        const node = cloudNodes.find((n) => n.id === nodeId);
        if (node) {
          const data = node.data as unknown as CloudNodeData;
          const spec = getServiceSpec(data.component?.type || '');
          latencyMin += spec.latencyMs[0];
          latencyMax += spec.latencyMs[1];
        }
      }
    }

    // --- WARNINGS ---
    const warnings: InsightWarning[] = [];

    const hasLB = cloudNodes.some((n) => {
      const data = n.data as unknown as CloudNodeData;
      return data.component?.type?.includes('elb') || data.component?.type?.includes('loadbalancer');
    });
    const hasMultiCompute =
      cloudNodes.filter((n) => {
        const data = n.data as unknown as CloudNodeData;
        return data.component?.category === 'Compute';
      }).length > 1;
    if (hasMultiCompute && !hasLB) {
      warnings.push({
        id: 'no-lb',
        type: 'reliability',
        severity: 'warning',
        title: 'No Load Balancer',
        description: 'Multiple compute instances without a load balancer',
        suggestion: 'Add a load balancer to distribute traffic evenly',
        nodeIds: [],
      });
    }

    const hasMonitoring = cloudNodes.some((n) => {
      const data = n.data as unknown as CloudNodeData;
      return data.component?.category === 'Monitoring';
    });
    if (!hasMonitoring && cloudNodes.length >= 3) {
      warnings.push({
        id: 'no-monitoring',
        type: 'reliability',
        severity: 'warning',
        title: 'No Monitoring',
        description: 'Architecture lacks observability components',
        suggestion: 'Add CloudWatch, Datadog, or similar monitoring',
        nodeIds: [],
      });
    }

    const hasSecurity = cloudNodes.some((n) => {
      const data = n.data as unknown as CloudNodeData;
      return data.component?.category === 'Security';
    });
    if (!hasSecurity && cloudNodes.length >= 3) {
      warnings.push({
        id: 'no-security',
        type: 'security',
        severity: 'critical',
        title: 'No Security Layer',
        description: 'No WAF, IAM, or security services detected',
        suggestion: 'Add IAM, WAF, or security groups to protect resources',
        nodeIds: [],
      });
    }

    const dbCount = cloudNodes.filter((n) => {
      const data = n.data as unknown as CloudNodeData;
      return data.component?.category === 'Database';
    }).length;
    const hasCache = cloudNodes.some((n) => {
      const data = n.data as unknown as CloudNodeData;
      return data.component?.type?.includes('cache') || data.component?.type?.includes('elasticache');
    });
    if (dbCount >= 2 && !hasCache) {
      warnings.push({
        id: 'no-cache',
        type: 'performance',
        severity: 'warning',
        title: 'No Caching Layer',
        description: 'Multiple databases without a cache — high read latency',
        suggestion: 'Add ElastiCache or Redis to reduce DB load',
        nodeIds: [],
      });
    }

    const singleAzNodes = cloudNodes.filter((n) => {
      const data = n.data as unknown as CloudNodeData;
      const spec = getServiceSpec(data.component?.type || '');
      return !spec.multiAz && data.component?.category !== 'Monitoring' && data.component?.category !== 'DevOps';
    });
    if (singleAzNodes.length > 0) {
      warnings.push({
        id: 'single-az',
        type: 'reliability',
        severity: 'info',
        title: 'Single-AZ Components',
        description: `${singleAzNodes.length} service(s) without multi-AZ redundancy`,
        suggestion: 'Consider multi-AZ deployment for production workloads',
        nodeIds: singleAzNodes.map((n) => n.id),
      });
    }

    // --- ARCHITECTURE SCORE ---
    const avgLatency = (latencyMin + latencyMax) / 2;
    const perfScore = Math.max(0, Math.min(100, 100 - avgLatency / 10));
    const reliabilityScore = Math.max(0, (overallAvailability - 95) * 20);

    const securityNodes = cloudNodes.filter((n) => {
      const data = n.data as unknown as CloudNodeData;
      return data.component?.category === 'Security';
    }).length;
    const securityScore = Math.min(100, securityNodes * 25 + (hasMonitoring ? 25 : 0));

    const autoScaleCount = cloudNodes.filter((n) => {
      const data = n.data as unknown as CloudNodeData;
      const spec = getServiceSpec(data.component?.type || '');
      return spec.scalingType === 'auto' || spec.scalingType === 'serverless';
    }).length;
    const scalabilityScore =
      cloudNodes.length > 0 ? Math.round((autoScaleCount / cloudNodes.length) * 100) : 0;

    // Reweighting (cost's 15% redistributed): perf 30, reliability 30, security 25, scalability 15
    const overall = Math.round(
      perfScore * 0.3 + reliabilityScore * 0.3 + securityScore * 0.25 + scalabilityScore * 0.15,
    );

    const score: ArchitectureScore = {
      overall,
      performance: Math.round(perfScore),
      reliability: Math.round(reliabilityScore),
      security: Math.round(securityScore),
      scalability: Math.round(scalabilityScore),
    };

    set({
      bottlenecks,
      availabilityChains,
      overallAvailability,
      score,
      warnings,
      endToEndLatency: { min: latencyMin, max: latencyMax },
    });
  },
}));
