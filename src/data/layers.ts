export interface ArchLayer {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const archLayers: ArchLayer[] = [
  { id: 'layer-presentation', name: 'Presentation Layer', description: 'UI / frontend / client apps', icon: 'Monitor', color: '#06b6d4' },
  { id: 'layer-application', name: 'Application Layer', description: 'App services / orchestration', icon: 'Layers', color: '#6366f1' },
  { id: 'layer-business', name: 'Business Logic Layer', description: 'Domain logic & workflows', icon: 'Briefcase', color: '#8b5cf6' },
  { id: 'layer-api', name: 'API Layer', description: 'REST / GraphQL / RPC endpoints', icon: 'Code2', color: '#10b981' },
  { id: 'layer-service', name: 'Service Layer', description: 'Microservices / functions', icon: 'Cog', color: '#22c55e' },
  { id: 'layer-data', name: 'Data Layer', description: 'Databases & data stores', icon: 'Database', color: '#f59e0b' },
  { id: 'layer-cache', name: 'Caching Layer', description: 'Redis / Memcached / CDN cache', icon: 'Zap', color: '#eab308' },
  { id: 'layer-integration', name: 'Integration Layer', description: 'Queues, events, message bus', icon: 'GitMerge', color: '#a855f7' },
  { id: 'layer-security', name: 'Security Layer', description: 'IAM, WAF, encryption, certs', icon: 'Shield', color: '#dc2626' },
  { id: 'layer-network', name: 'Network Layer', description: 'VPC, subnets, routing', icon: 'Network', color: '#3b82f6' },
  { id: 'layer-infrastructure', name: 'Infrastructure Layer', description: 'Compute, runtime, OS', icon: 'Server', color: '#64748b' },
  { id: 'layer-monitoring', name: 'Monitoring Layer', description: 'Logs, metrics, traces, alerts', icon: 'Activity', color: '#ec4899' },
  { id: 'layer-edge', name: 'Edge Layer', description: 'CDN / edge functions', icon: 'Radio', color: '#0ea5e9' },
  { id: 'layer-devops', name: 'DevOps Layer', description: 'CI/CD, deployment, IaC', icon: 'GitBranch', color: '#7c3aed' },
];

export const customLayerColors: { name: string; value: string }[] = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Slate', value: '#64748b' },
];
