import type { ProviderLibrary } from '../types';

export const genericLibrary: ProviderLibrary = {
  provider: 'generic',
  label: 'Generic / Cloud Agnostic',
  color: '#6366f1',
  categories: [
    {
      name: 'Compute',
      components: [
        { id: 'gen-server', type: 'gen-server', provider: 'generic', category: 'Compute', name: 'Server', description: 'Generic server instance', icon: 'Server', color: '#6366f1' },
        { id: 'gen-container', type: 'gen-container', provider: 'generic', category: 'Compute', name: 'Container', description: 'Docker container', icon: 'Container', color: '#6366f1' },
        { id: 'gen-serverless', type: 'gen-serverless', provider: 'generic', category: 'Compute', name: 'Serverless Function', description: 'FaaS function', icon: 'Zap', color: '#6366f1' },
        { id: 'gen-kubernetes', type: 'gen-kubernetes', provider: 'generic', category: 'Compute', name: 'Kubernetes Cluster', description: 'Container orchestration', icon: 'Box', color: '#6366f1' },
        { id: 'gen-worker', type: 'gen-worker', provider: 'generic', category: 'Compute', name: 'Worker', description: 'Background worker process', icon: 'Cog', color: '#6366f1' },
      ],
    },
    {
      name: 'Storage',
      components: [
        { id: 'gen-objectstorage', type: 'gen-objectstorage', provider: 'generic', category: 'Storage', name: 'Object Storage', description: 'S3-compatible object store', icon: 'HardDrive', color: '#6366f1' },
        { id: 'gen-blockstorage', type: 'gen-blockstorage', provider: 'generic', category: 'Storage', name: 'Block Storage', description: 'Persistent block volume', icon: 'Database', color: '#6366f1' },
        { id: 'gen-filestorage', type: 'gen-filestorage', provider: 'generic', category: 'Storage', name: 'File Storage', description: 'Network file system', icon: 'FolderOpen', color: '#6366f1' },
      ],
    },
    {
      name: 'Database',
      components: [
        { id: 'gen-sqldb', type: 'gen-sqldb', provider: 'generic', category: 'Database', name: 'SQL Database', description: 'Relational database', icon: 'Database', color: '#6366f1' },
        { id: 'gen-nosqldb', type: 'gen-nosqldb', provider: 'generic', category: 'Database', name: 'NoSQL Database', description: 'Document/key-value store', icon: 'FileText', color: '#6366f1' },
        { id: 'gen-graphdb', type: 'gen-graphdb', provider: 'generic', category: 'Database', name: 'Graph Database', description: 'Graph-based database', icon: 'GitBranch', color: '#6366f1' },
        { id: 'gen-cache', type: 'gen-cache', provider: 'generic', category: 'Database', name: 'Cache', description: 'In-memory cache (Redis/Memcached)', icon: 'Cpu', color: '#6366f1' },
        { id: 'gen-datawarehouse', type: 'gen-datawarehouse', provider: 'generic', category: 'Database', name: 'Data Warehouse', description: 'Analytical data warehouse', icon: 'BarChart3', color: '#6366f1' },
        { id: 'gen-vectordb', type: 'gen-vectordb', provider: 'generic', category: 'Database', name: 'Vector Database', description: 'Vector similarity search', icon: 'Sparkles', color: '#6366f1' },
      ],
    },
    {
      name: 'Networking',
      components: [
        { id: 'gen-loadbalancer', type: 'gen-loadbalancer', provider: 'generic', category: 'Networking', name: 'Load Balancer', description: 'Traffic distribution', icon: 'Split', color: '#6366f1' },
        { id: 'gen-cdn', type: 'gen-cdn', provider: 'generic', category: 'Networking', name: 'CDN', description: 'Content delivery network', icon: 'Radio', color: '#6366f1' },
        { id: 'gen-dns', type: 'gen-dns', provider: 'generic', category: 'Networking', name: 'DNS', description: 'Domain name system', icon: 'Globe', color: '#6366f1' },
        { id: 'gen-apigateway', type: 'gen-apigateway', provider: 'generic', category: 'Networking', name: 'API Gateway', description: 'API management & routing', icon: 'ArrowLeftRight', color: '#6366f1' },
        { id: 'gen-firewall', type: 'gen-firewall', provider: 'generic', category: 'Networking', name: 'Firewall', description: 'Network firewall', icon: 'ShieldAlert', color: '#6366f1' },
        { id: 'gen-vpn', type: 'gen-vpn', provider: 'generic', category: 'Networking', name: 'VPN', description: 'Virtual private network', icon: 'Lock', color: '#6366f1' },
        { id: 'gen-reverseproxy', type: 'gen-reverseproxy', provider: 'generic', category: 'Networking', name: 'Reverse Proxy', description: 'Nginx/HAProxy/Traefik', icon: 'ArrowLeftRight', color: '#6366f1' },
      ],
    },
    {
      name: 'Messaging',
      components: [
        { id: 'gen-messagequeue', type: 'gen-messagequeue', provider: 'generic', category: 'Messaging', name: 'Message Queue', description: 'Async message queue', icon: 'MailOpen', color: '#6366f1' },
        { id: 'gen-eventbus', type: 'gen-eventbus', provider: 'generic', category: 'Messaging', name: 'Event Bus', description: 'Event-driven pub/sub', icon: 'Workflow', color: '#6366f1' },
        { id: 'gen-stream', type: 'gen-stream', provider: 'generic', category: 'Messaging', name: 'Stream Processor', description: 'Real-time stream processing', icon: 'Activity', color: '#6366f1' },
        { id: 'gen-websocket', type: 'gen-websocket', provider: 'generic', category: 'Messaging', name: 'WebSocket Server', description: 'Real-time bidirectional comms', icon: 'MessageSquare', color: '#6366f1' },
      ],
    },
    {
      name: 'Clients',
      components: [
        { id: 'gen-browser', type: 'gen-browser', provider: 'generic', category: 'Clients', name: 'Web Browser', description: 'Web client / SPA', icon: 'Globe', color: '#6366f1' },
        { id: 'gen-mobileapp', type: 'gen-mobileapp', provider: 'generic', category: 'Clients', name: 'Mobile App', description: 'iOS/Android app', icon: 'Smartphone', color: '#6366f1' },
        { id: 'gen-desktopapp', type: 'gen-desktopapp', provider: 'generic', category: 'Clients', name: 'Desktop App', description: 'Desktop application', icon: 'Monitor', color: '#6366f1' },
        { id: 'gen-iot', type: 'gen-iot', provider: 'generic', category: 'Clients', name: 'IoT Device', description: 'Internet of Things device', icon: 'Wifi', color: '#6366f1' },
        { id: 'gen-cli', type: 'gen-cli', provider: 'generic', category: 'Clients', name: 'CLI Tool', description: 'Command-line interface', icon: 'Terminal', color: '#6366f1' },
      ],
    },
    {
      name: 'External',
      components: [
        { id: 'gen-thirdpartyapi', type: 'gen-thirdpartyapi', provider: 'generic', category: 'External', name: 'Third-party API', description: 'External API service', icon: 'ExternalLink', color: '#6366f1' },
        { id: 'gen-saas', type: 'gen-saas', provider: 'generic', category: 'External', name: 'SaaS Service', description: 'Software-as-a-service', icon: 'Cloud', color: '#6366f1' },
        { id: 'gen-paymentgateway', type: 'gen-paymentgateway', provider: 'generic', category: 'External', name: 'Payment Gateway', description: 'Stripe/PayPal/etc', icon: 'CreditCard', color: '#6366f1' },
        { id: 'gen-emailservice', type: 'gen-emailservice', provider: 'generic', category: 'External', name: 'Email Service', description: 'SendGrid/SES/Mailgun', icon: 'Mail', color: '#6366f1' },
        { id: 'gen-auth', type: 'gen-auth', provider: 'generic', category: 'External', name: 'Auth Provider', description: 'OAuth/OIDC provider', icon: 'UserCheck', color: '#6366f1' },
      ],
    },
    {
      name: 'DevOps',
      components: [
        { id: 'gen-cicd', type: 'gen-cicd', provider: 'generic', category: 'DevOps', name: 'CI/CD Pipeline', description: 'Build & deploy pipeline', icon: 'GitBranch', color: '#6366f1' },
        { id: 'gen-registry', type: 'gen-registry', provider: 'generic', category: 'DevOps', name: 'Container Registry', description: 'Docker image registry', icon: 'Package', color: '#6366f1' },
        { id: 'gen-monitoring', type: 'gen-monitoring', provider: 'generic', category: 'DevOps', name: 'Monitoring', description: 'Prometheus/Grafana/Datadog', icon: 'MonitorDot', color: '#6366f1' },
        { id: 'gen-logging', type: 'gen-logging', provider: 'generic', category: 'DevOps', name: 'Logging', description: 'Centralized log management', icon: 'ScrollText', color: '#6366f1' },
        { id: 'gen-tracing', type: 'gen-tracing', provider: 'generic', category: 'DevOps', name: 'Tracing', description: 'Distributed tracing', icon: 'Search', color: '#6366f1' },
        { id: 'gen-gitrepo', type: 'gen-gitrepo', provider: 'generic', category: 'DevOps', name: 'Git Repository', description: 'Source code repository', icon: 'GitBranch', color: '#6366f1' },
      ],
    },
    {
      name: 'Infrastructure Groups',
      components: [
        { id: 'gen-region', type: 'gen-region', provider: 'generic', category: 'Infrastructure Groups', name: 'Region', description: 'Cloud region boundary', icon: 'Globe', color: '#6366f1' },
        { id: 'gen-vpc', type: 'gen-vpc', provider: 'generic', category: 'Infrastructure Groups', name: 'VPC', description: 'Virtual private cloud boundary', icon: 'Network', color: '#8b5cf6' },
        { id: 'gen-subnet-public', type: 'gen-subnet-public', provider: 'generic', category: 'Infrastructure Groups', name: 'Public Subnet', description: 'Public subnet boundary', icon: 'Globe', color: '#10b981' },
        { id: 'gen-subnet-private', type: 'gen-subnet-private', provider: 'generic', category: 'Infrastructure Groups', name: 'Private Subnet', description: 'Private subnet boundary', icon: 'Lock', color: '#f59e0b' },
        { id: 'gen-az', type: 'gen-az', provider: 'generic', category: 'Infrastructure Groups', name: 'Availability Zone', description: 'AZ boundary', icon: 'Server', color: '#3b82f6' },
        { id: 'gen-cluster', type: 'gen-cluster', provider: 'generic', category: 'Infrastructure Groups', name: 'Cluster', description: 'Kubernetes/ECS cluster boundary', icon: 'Box', color: '#ec4899' },
        { id: 'gen-securitygroup', type: 'gen-securitygroup', provider: 'generic', category: 'Infrastructure Groups', name: 'Security Group', description: 'Firewall rule boundary', icon: 'Shield', color: '#ef4444' },
        { id: 'gen-group', type: 'gen-group', provider: 'generic', category: 'Infrastructure Groups', name: 'Generic Group', description: 'Custom grouping container', icon: 'Square', color: '#6b7280' },
      ],
    },
  ],
};
