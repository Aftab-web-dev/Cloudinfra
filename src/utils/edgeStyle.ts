import { MarkerType } from '@xyflow/react';

export type EdgeKind =
  | 'http'
  | 'grpc'
  | 'db'
  | 'queue'
  | 'event'
  | 'stream'
  | 'cache'
  | 'auth'
  | 'default';

export const EDGE_COLORS: Record<EdgeKind, string> = {
  http: '#3b82f6',     // blue   — REST/HTTP/API
  grpc: '#8b5cf6',     // violet — gRPC/RPC
  db: '#10b981',       // emerald — SQL/DB read/write
  queue: '#f59e0b',    // amber  — async/queue/SQS
  event: '#ec4899',    // pink   — event/pubsub/Kafka
  stream: '#06b6d4',   // cyan   — websocket/stream
  cache: '#ef4444',    // red    — cache/Redis
  auth: '#a855f7',     // purple — auth/OIDC/JWT
  default: '#6366f1',  // indigo — fallback
};

export function detectEdgeKind(label?: string): EdgeKind {
  if (!label) return 'default';
  const l = label.toLowerCase();
  if (/grpc|protobuf|proto/.test(l)) return 'grpc';
  if (/websocket|\bws\b|sse/.test(l)) return 'stream';
  if (/cache|redis|memcache|elasticache/.test(l)) return 'cache';
  if (/event|pub.?sub|subscribe|topic|kafka|kinesis|stream/.test(l)) return 'event';
  if (/async|queue|sqs|rabbit|amqp|publish|enqueue|sns/.test(l)) return 'queue';
  if (/sql|jdbc|odbc|postgres|mysql|read|write|query|tcp.?5432|tcp.?3306|tcp.?27017/.test(l)) return 'db';
  if (/auth|oauth|oidc|jwt|saml|login|cognito/.test(l)) return 'auth';
  if (/http|rest|api|fetch|xhr|graphql|gql/.test(l)) return 'http';
  return 'default';
}

interface EdgeStyleOptions {
  thick?: boolean;
}

export function getEdgeStyle(label?: string, opts: EdgeStyleOptions = {}) {
  const kind = detectEdgeKind(label);
  const color = EDGE_COLORS[kind];
  const strokeWidth = opts.thick ? 3.5 : 2.5;
  return {
    style: { stroke: color, strokeWidth, strokeLinecap: 'round' as const },
    markerStart: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
    labelStyle: { fill: color, fontWeight: 600, fontSize: 10 },
    labelBgStyle: { fill: 'white', fillOpacity: 0.85 },
  };
}

export function getEdgeColor(label?: string): string {
  return EDGE_COLORS[detectEdgeKind(label)];
}
