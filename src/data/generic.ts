import type { ProviderLibrary } from '../types';

const INDIGO = '#6366f1';
const SECURITY_RED = '#dc2626';
const IAC_VIOLET = '#7c3aed';
const NET_PUBLIC = '#10b981';
const NET_PRIVATE = '#f59e0b';
const NET_VPC = '#8b5cf6';
const NET_AZ = '#3b82f6';
const NET_CLUSTER = '#ec4899';
const NET_GROUP = '#6b7280';

export const genericLibrary: ProviderLibrary = {
  provider: 'generic',
  label: 'Generic / Cloud Agnostic',
  color: INDIGO,
  categories: [
    {
      name: 'Compute',
      components: [
        { id: 'gen-server', type: 'gen-server', provider: 'generic', category: 'Compute', name: 'Server', description: 'Generic server instance', icon: 'Server', color: INDIGO },
        { id: 'gen-container', type: 'gen-container', provider: 'generic', category: 'Compute', name: 'Container', description: 'Docker container', icon: 'Container', color: INDIGO },
        { id: 'gen-serverless', type: 'gen-serverless', provider: 'generic', category: 'Compute', name: 'Serverless Function', description: 'FaaS function', icon: 'Zap', color: INDIGO },
        { id: 'gen-kubernetes', type: 'gen-kubernetes', provider: 'generic', category: 'Compute', name: 'Kubernetes Cluster', description: 'Container orchestration', icon: 'Box', color: INDIGO },
        { id: 'gen-worker', type: 'gen-worker', provider: 'generic', category: 'Compute', name: 'Worker', description: 'Background worker process', icon: 'Cog', color: INDIGO },
      ],
    },
    {
      name: 'Network & Layers',
      components: [
        { id: 'gen-region', type: 'gen-region', provider: 'generic', category: 'Network & Layers', name: 'Region', description: 'Cloud region boundary', icon: 'Globe', color: INDIGO },
        { id: 'gen-vpc', type: 'gen-vpc', provider: 'generic', category: 'Network & Layers', name: 'VPC', description: 'Virtual private cloud boundary', icon: 'Network', color: NET_VPC },
        { id: 'gen-subnet-public', type: 'gen-subnet-public', provider: 'generic', category: 'Network & Layers', name: 'Public Subnet', description: 'Public subnet boundary', icon: 'Globe', color: NET_PUBLIC },
        { id: 'gen-subnet-private', type: 'gen-subnet-private', provider: 'generic', category: 'Network & Layers', name: 'Private Subnet', description: 'Private subnet boundary', icon: 'Lock', color: NET_PRIVATE },
        { id: 'gen-az', type: 'gen-az', provider: 'generic', category: 'Network & Layers', name: 'Availability Zone', description: 'AZ boundary', icon: 'Server', color: NET_AZ },
        { id: 'gen-cluster', type: 'gen-cluster', provider: 'generic', category: 'Network & Layers', name: 'Cluster', description: 'Kubernetes/ECS cluster boundary', icon: 'Box', color: NET_CLUSTER },
        { id: 'gen-securitygroup', type: 'gen-securitygroup', provider: 'generic', category: 'Network & Layers', name: 'Security Group', description: 'Firewall rule boundary', icon: 'Shield', color: SECURITY_RED },
        { id: 'gen-group', type: 'gen-group', provider: 'generic', category: 'Network & Layers', name: 'Generic Group', description: 'Custom grouping container', icon: 'Square', color: NET_GROUP },
      ],
    },
    {
      name: 'Storage',
      components: [
        { id: 'gen-objectstorage', type: 'gen-objectstorage', provider: 'generic', category: 'Storage', name: 'Object Storage', description: 'S3-compatible object store', icon: 'HardDrive', color: INDIGO },
        { id: 'gen-blockstorage', type: 'gen-blockstorage', provider: 'generic', category: 'Storage', name: 'Block Storage', description: 'Persistent block volume', icon: 'Database', color: INDIGO },
        { id: 'gen-filestorage', type: 'gen-filestorage', provider: 'generic', category: 'Storage', name: 'File Storage', description: 'Network file system', icon: 'FolderOpen', color: INDIGO },
      ],
    },
    {
      name: 'Database',
      components: [
        { id: 'gen-sqldb', type: 'gen-sqldb', provider: 'generic', category: 'Database', name: 'SQL Database', description: 'Relational database', icon: 'Database', color: INDIGO },
        { id: 'gen-nosqldb', type: 'gen-nosqldb', provider: 'generic', category: 'Database', name: 'NoSQL Database', description: 'Document/key-value store', icon: 'FileText', color: INDIGO },
        { id: 'gen-graphdb', type: 'gen-graphdb', provider: 'generic', category: 'Database', name: 'Graph Database', description: 'Graph-based database', icon: 'GitBranch', color: INDIGO },
        { id: 'gen-cache', type: 'gen-cache', provider: 'generic', category: 'Database', name: 'Cache', description: 'In-memory cache (Redis/Memcached)', icon: 'Cpu', color: INDIGO },
        { id: 'gen-datawarehouse', type: 'gen-datawarehouse', provider: 'generic', category: 'Database', name: 'Data Warehouse', description: 'Analytical data warehouse', icon: 'BarChart3', color: INDIGO },
        { id: 'gen-vectordb', type: 'gen-vectordb', provider: 'generic', category: 'Database', name: 'Vector Database', description: 'Vector similarity search', icon: 'Sparkles', color: INDIGO },
      ],
    },
    {
      name: 'Security',
      components: [
        { id: 'gen-iam', type: 'gen-iam', provider: 'generic', category: 'Security', name: 'IAM', description: 'Identity & access management', icon: 'KeyRound', color: SECURITY_RED },
        { id: 'gen-kms', type: 'gen-kms', provider: 'generic', category: 'Security', name: 'KMS / Key Vault', description: 'Encryption key management', icon: 'Key', color: SECURITY_RED },
        { id: 'gen-secrets', type: 'gen-secrets', provider: 'generic', category: 'Security', name: 'Secrets Manager', description: 'Runtime secret storage', icon: 'Lock', color: SECURITY_RED },
        { id: 'gen-waf', type: 'gen-waf', provider: 'generic', category: 'Security', name: 'WAF', description: 'Web application firewall', icon: 'ShieldCheck', color: SECURITY_RED },
        { id: 'gen-ddos', type: 'gen-ddos', provider: 'generic', category: 'Security', name: 'DDoS Protection', description: 'DDoS mitigation', icon: 'ShieldAlert', color: SECURITY_RED },
        { id: 'gen-bastion', type: 'gen-bastion', provider: 'generic', category: 'Security', name: 'Bastion Host', description: 'SSH jump box', icon: 'DoorOpen', color: SECURITY_RED },
        { id: 'gen-cert', type: 'gen-cert', provider: 'generic', category: 'Security', name: 'Cert Manager', description: 'TLS certificate provisioning', icon: 'BadgeCheck', color: SECURITY_RED },
        { id: 'gen-siem', type: 'gen-siem', provider: 'generic', category: 'Security', name: 'SIEM', description: 'Security event monitoring', icon: 'Eye', color: SECURITY_RED },
        { id: 'gen-idp', type: 'gen-idp', provider: 'generic', category: 'Security', name: 'Identity Provider', description: 'OIDC/SAML IdP (Okta, Auth0)', icon: 'Users', color: SECURITY_RED },
        { id: 'gen-mfa', type: 'gen-mfa', provider: 'generic', category: 'Security', name: 'MFA Service', description: 'Multi-factor authentication', icon: 'Smartphone', color: SECURITY_RED },
        { id: 'gen-vault', type: 'gen-vault', provider: 'generic', category: 'Security', name: 'Vault', description: 'HashiCorp Vault / secret store', icon: 'Vault', color: SECURITY_RED },
      ],
    },
    {
      name: 'Networking',
      components: [
        { id: 'gen-loadbalancer', type: 'gen-loadbalancer', provider: 'generic', category: 'Networking', name: 'Load Balancer', description: 'Traffic distribution', icon: 'Split', color: INDIGO },
        { id: 'gen-cdn', type: 'gen-cdn', provider: 'generic', category: 'Networking', name: 'CDN', description: 'Content delivery network', icon: 'Radio', color: INDIGO },
        { id: 'gen-dns', type: 'gen-dns', provider: 'generic', category: 'Networking', name: 'DNS', description: 'Domain name system', icon: 'Globe', color: INDIGO },
        { id: 'gen-apigateway', type: 'gen-apigateway', provider: 'generic', category: 'Networking', name: 'API Gateway', description: 'API management & routing', icon: 'ArrowLeftRight', color: INDIGO },
        { id: 'gen-firewall', type: 'gen-firewall', provider: 'generic', category: 'Networking', name: 'Firewall', description: 'Network firewall', icon: 'ShieldAlert', color: INDIGO },
        { id: 'gen-vpn', type: 'gen-vpn', provider: 'generic', category: 'Networking', name: 'VPN', description: 'Virtual private network', icon: 'Lock', color: INDIGO },
        { id: 'gen-reverseproxy', type: 'gen-reverseproxy', provider: 'generic', category: 'Networking', name: 'Reverse Proxy', description: 'Nginx/HAProxy/Traefik', icon: 'ArrowLeftRight', color: INDIGO },
      ],
    },
    {
      name: 'Messaging',
      components: [
        { id: 'gen-messagequeue', type: 'gen-messagequeue', provider: 'generic', category: 'Messaging', name: 'Message Queue', description: 'Async message queue', icon: 'MailOpen', color: INDIGO },
        { id: 'gen-eventbus', type: 'gen-eventbus', provider: 'generic', category: 'Messaging', name: 'Event Bus', description: 'Event-driven pub/sub', icon: 'Workflow', color: INDIGO },
        { id: 'gen-stream', type: 'gen-stream', provider: 'generic', category: 'Messaging', name: 'Stream Processor', description: 'Real-time stream processing', icon: 'Activity', color: INDIGO },
        { id: 'gen-websocket', type: 'gen-websocket', provider: 'generic', category: 'Messaging', name: 'WebSocket Server', description: 'Real-time bidirectional comms', icon: 'MessageSquare', color: INDIGO },
        { id: 'gen-kafka', type: 'gen-kafka', provider: 'generic', category: 'Messaging', name: 'Kafka', description: 'Distributed event streaming platform', icon: 'Layers', color: '#231F20' },
        { id: 'gen-mqtt', type: 'gen-mqtt', provider: 'generic', category: 'Messaging', name: 'MQTT Broker', description: 'Lightweight pub/sub for IoT', icon: 'Radio', color: '#660066' },
        { id: 'gen-rabbitmq', type: 'gen-rabbitmq', provider: 'generic', category: 'Messaging', name: 'RabbitMQ', description: 'AMQP message broker', icon: 'Rabbit', color: '#FF6600' },
        { id: 'gen-nats', type: 'gen-nats', provider: 'generic', category: 'Messaging', name: 'NATS', description: 'High-performance messaging system', icon: 'Zap', color: '#27AAE1' },
        { id: 'gen-pulsar', type: 'gen-pulsar', provider: 'generic', category: 'Messaging', name: 'Apache Pulsar', description: 'Cloud-native pub/sub & streaming', icon: 'Star', color: '#188FFF' },
        { id: 'gen-activemq', type: 'gen-activemq', provider: 'generic', category: 'Messaging', name: 'ActiveMQ', description: 'JMS message broker', icon: 'Inbox', color: '#78BE20' },
        { id: 'gen-redis-streams', type: 'gen-redis-streams', provider: 'generic', category: 'Messaging', name: 'Redis Streams', description: 'Append-only log on Redis', icon: 'AlignJustify', color: '#DC382D' },
        { id: 'gen-zeromq', type: 'gen-zeromq', provider: 'generic', category: 'Messaging', name: 'ZeroMQ', description: 'Brokerless messaging library', icon: 'Send', color: '#DF0000' },
        { id: 'gen-amqp', type: 'gen-amqp', provider: 'generic', category: 'Messaging', name: 'AMQP Broker', description: 'Advanced Message Queuing Protocol', icon: 'Mailbox', color: INDIGO },
        { id: 'gen-grpc-stream', type: 'gen-grpc-stream', provider: 'generic', category: 'Messaging', name: 'gRPC Streaming', description: 'Bidirectional RPC streaming', icon: 'ArrowLeftRight', color: INDIGO },
        { id: 'gen-sse', type: 'gen-sse', provider: 'generic', category: 'Messaging', name: 'Server-Sent Events', description: 'One-way push from server', icon: 'ArrowRight', color: INDIGO },
        { id: 'gen-flink', type: 'gen-flink', provider: 'generic', category: 'Messaging', name: 'Apache Flink', description: 'Stream & batch processing', icon: 'Waves', color: '#E6526F' },
        { id: 'gen-spark-streaming', type: 'gen-spark-streaming', provider: 'generic', category: 'Messaging', name: 'Spark Streaming', description: 'Micro-batch streaming engine', icon: 'Sparkles', color: '#E25A1C' },
      ],
    },
    {
      name: 'Infrastructure as Code',
      components: [
        { id: 'gen-terraform', type: 'gen-terraform', provider: 'generic', category: 'Infrastructure as Code', name: 'Terraform', description: 'HashiCorp IaC', icon: 'FileCode2', color: IAC_VIOLET },
        { id: 'gen-cloudformation', type: 'gen-cloudformation', provider: 'generic', category: 'Infrastructure as Code', name: 'CloudFormation', description: 'AWS native IaC', icon: 'FileStack', color: IAC_VIOLET },
        { id: 'gen-pulumi', type: 'gen-pulumi', provider: 'generic', category: 'Infrastructure as Code', name: 'Pulumi', description: 'Code-first IaC', icon: 'Code2', color: IAC_VIOLET },
        { id: 'gen-ansible', type: 'gen-ansible', provider: 'generic', category: 'Infrastructure as Code', name: 'Ansible', description: 'Configuration management', icon: 'Wrench', color: IAC_VIOLET },
        { id: 'gen-helm', type: 'gen-helm', provider: 'generic', category: 'Infrastructure as Code', name: 'Helm', description: 'Kubernetes package manager', icon: 'Anchor', color: IAC_VIOLET },
        { id: 'gen-bicep', type: 'gen-bicep', provider: 'generic', category: 'Infrastructure as Code', name: 'ARM / Bicep', description: 'Azure native IaC', icon: 'FileBox', color: IAC_VIOLET },
        { id: 'gen-cdk', type: 'gen-cdk', provider: 'generic', category: 'Infrastructure as Code', name: 'AWS CDK', description: 'TypeScript/Python AWS IaC', icon: 'Boxes', color: IAC_VIOLET },
      ],
    },
    {
      name: 'DevOps',
      components: [
        { id: 'gen-cicd', type: 'gen-cicd', provider: 'generic', category: 'DevOps', name: 'CI/CD Pipeline', description: 'Build & deploy pipeline', icon: 'GitBranch', color: INDIGO },
        { id: 'gen-registry', type: 'gen-registry', provider: 'generic', category: 'DevOps', name: 'Container Registry', description: 'Docker image registry', icon: 'Package', color: INDIGO },
        { id: 'gen-monitoring', type: 'gen-monitoring', provider: 'generic', category: 'DevOps', name: 'Monitoring', description: 'Prometheus/Grafana/Datadog', icon: 'MonitorDot', color: INDIGO },
        { id: 'gen-logging', type: 'gen-logging', provider: 'generic', category: 'DevOps', name: 'Logging', description: 'Centralized log management', icon: 'ScrollText', color: INDIGO },
        { id: 'gen-tracing', type: 'gen-tracing', provider: 'generic', category: 'DevOps', name: 'Tracing', description: 'Distributed tracing', icon: 'Search', color: INDIGO },
        { id: 'gen-gitrepo', type: 'gen-gitrepo', provider: 'generic', category: 'DevOps', name: 'Git Repository', description: 'Source code repository', icon: 'GitBranch', color: INDIGO },
      ],
    },
    {
      name: 'Clients',
      components: [
        { id: 'gen-browser', type: 'gen-browser', provider: 'generic', category: 'Clients', name: 'Web Browser', description: 'Web client / SPA', icon: 'Globe', color: INDIGO },
        { id: 'gen-mobileapp', type: 'gen-mobileapp', provider: 'generic', category: 'Clients', name: 'Mobile App', description: 'iOS/Android app', icon: 'Smartphone', color: INDIGO },
        { id: 'gen-desktopapp', type: 'gen-desktopapp', provider: 'generic', category: 'Clients', name: 'Desktop App', description: 'Desktop application', icon: 'Monitor', color: INDIGO },
        { id: 'gen-iot', type: 'gen-iot', provider: 'generic', category: 'Clients', name: 'IoT Device', description: 'Internet of Things device', icon: 'Wifi', color: INDIGO },
        { id: 'gen-cli', type: 'gen-cli', provider: 'generic', category: 'Clients', name: 'CLI Tool', description: 'Command-line interface', icon: 'Terminal', color: INDIGO },
      ],
    },
    {
      name: 'External',
      components: [
        { id: 'gen-thirdpartyapi', type: 'gen-thirdpartyapi', provider: 'generic', category: 'External', name: 'Third-party API', description: 'External API service', icon: 'ExternalLink', color: INDIGO },
        { id: 'gen-saas', type: 'gen-saas', provider: 'generic', category: 'External', name: 'SaaS Service', description: 'Software-as-a-service', icon: 'Cloud', color: INDIGO },
        { id: 'gen-paymentgateway', type: 'gen-paymentgateway', provider: 'generic', category: 'External', name: 'Payment Gateway', description: 'Stripe/PayPal/etc', icon: 'CreditCard', color: INDIGO },
        { id: 'gen-emailservice', type: 'gen-emailservice', provider: 'generic', category: 'External', name: 'Email Service', description: 'SendGrid/SES/Mailgun', icon: 'Mail', color: INDIGO },
        { id: 'gen-auth', type: 'gen-auth', provider: 'generic', category: 'External', name: 'Auth Provider', description: 'OAuth/OIDC provider', icon: 'UserCheck', color: INDIGO },
      ],
    },
  ],
};
