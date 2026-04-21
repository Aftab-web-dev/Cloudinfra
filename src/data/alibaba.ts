import type { ProviderLibrary } from '../types';

export const alibabaLibrary: ProviderLibrary = {
  provider: 'alibaba',
  label: 'Alibaba Cloud',
  color: '#FF6A00',
  categories: [
    {
      name: 'Compute',
      components: [
        { id: 'ali-ecs', type: 'ali-ecs', provider: 'alibaba', category: 'Compute', name: 'ECS', description: 'Elastic compute service', icon: 'Server', color: '#FF6A00' },
        { id: 'ali-functioncompute', type: 'ali-functioncompute', provider: 'alibaba', category: 'Compute', name: 'Function Compute', description: 'Serverless functions', icon: 'Zap', color: '#FF6A00' },
        { id: 'ali-ack', type: 'ali-ack', provider: 'alibaba', category: 'Compute', name: 'ACK', description: 'Container service for Kubernetes', icon: 'Box', color: '#FF6A00' },
        { id: 'ali-sae', type: 'ali-sae', provider: 'alibaba', category: 'Compute', name: 'SAE', description: 'Serverless app engine', icon: 'Rocket', color: '#FF6A00' },
      ],
    },
    {
      name: 'Storage',
      components: [
        { id: 'ali-oss', type: 'ali-oss', provider: 'alibaba', category: 'Storage', name: 'OSS', description: 'Object storage service', icon: 'HardDrive', color: '#FF6A00' },
        { id: 'ali-nas', type: 'ali-nas', provider: 'alibaba', category: 'Storage', name: 'NAS', description: 'Network attached storage', icon: 'FolderOpen', color: '#FF6A00' },
        { id: 'ali-tablestore', type: 'ali-tablestore', provider: 'alibaba', category: 'Storage', name: 'Table Store', description: 'NoSQL data storage', icon: 'Table', color: '#FF6A00' },
      ],
    },
    {
      name: 'Database',
      components: [
        { id: 'ali-rds', type: 'ali-rds', provider: 'alibaba', category: 'Database', name: 'ApsaraDB RDS', description: 'Managed relational database', icon: 'Database', color: '#FF6A00' },
        { id: 'ali-polardb', type: 'ali-polardb', provider: 'alibaba', category: 'Database', name: 'PolarDB', description: 'Cloud-native relational DB', icon: 'Database', color: '#FF6A00' },
        { id: 'ali-tair', type: 'ali-tair', provider: 'alibaba', category: 'Database', name: 'Tair', description: 'In-memory database (Redis-compatible)', icon: 'Cpu', color: '#FF6A00' },
        { id: 'ali-analyticdb', type: 'ali-analyticdb', provider: 'alibaba', category: 'Database', name: 'AnalyticDB', description: 'Real-time data warehouse', icon: 'BarChart3', color: '#FF6A00' },
        { id: 'ali-lindorm', type: 'ali-lindorm', provider: 'alibaba', category: 'Database', name: 'Lindorm', description: 'Multi-model database', icon: 'Layers', color: '#FF6A00' },
      ],
    },
    {
      name: 'Networking',
      components: [
        { id: 'ali-vpc', type: 'ali-vpc', provider: 'alibaba', category: 'Networking', name: 'VPC', description: 'Virtual private cloud', icon: 'Network', color: '#FF6A00' },
        { id: 'ali-slb', type: 'ali-slb', provider: 'alibaba', category: 'Networking', name: 'SLB', description: 'Server load balancer', icon: 'Split', color: '#FF6A00' },
        { id: 'ali-cdn', type: 'ali-cdn', provider: 'alibaba', category: 'Networking', name: 'CDN', description: 'Content delivery network', icon: 'Radio', color: '#FF6A00' },
        { id: 'ali-nat', type: 'ali-nat', provider: 'alibaba', category: 'Networking', name: 'NAT Gateway', description: 'Network address translation', icon: 'ArrowLeftRight', color: '#FF6A00' },
        { id: 'ali-apigateway', type: 'ali-apigateway', provider: 'alibaba', category: 'Networking', name: 'API Gateway', description: 'API management', icon: 'Waypoints', color: '#FF6A00' },
      ],
    },
    {
      name: 'Security',
      components: [
        { id: 'ali-ram', type: 'ali-ram', provider: 'alibaba', category: 'Security', name: 'RAM', description: 'Resource access management', icon: 'Shield', color: '#FF6A00' },
        { id: 'ali-kms', type: 'ali-kms', provider: 'alibaba', category: 'Security', name: 'KMS', description: 'Key management service', icon: 'Key', color: '#FF6A00' },
        { id: 'ali-waf', type: 'ali-waf', provider: 'alibaba', category: 'Security', name: 'WAF', description: 'Web application firewall', icon: 'ShieldAlert', color: '#FF6A00' },
        { id: 'ali-antiddos', type: 'ali-antiddos', provider: 'alibaba', category: 'Security', name: 'Anti-DDoS', description: 'DDoS protection', icon: 'ShieldAlert', color: '#FF6A00' },
      ],
    },
    {
      name: 'Messaging',
      components: [
        { id: 'ali-mns', type: 'ali-mns', provider: 'alibaba', category: 'Messaging', name: 'MNS', description: 'Message notification service', icon: 'MailOpen', color: '#FF6A00' },
        { id: 'ali-eventbridge', type: 'ali-eventbridge', provider: 'alibaba', category: 'Messaging', name: 'EventBridge', description: 'Serverless event bus', icon: 'Workflow', color: '#FF6A00' },
        { id: 'ali-rocketmq', type: 'ali-rocketmq', provider: 'alibaba', category: 'Messaging', name: 'RocketMQ', description: 'Distributed message queue', icon: 'MessageSquare', color: '#FF6A00' },
      ],
    },
    {
      name: 'AI & ML',
      components: [
        { id: 'ali-pai', type: 'ali-pai', provider: 'alibaba', category: 'AI & ML', name: 'PAI', description: 'Machine learning platform', icon: 'Brain', color: '#FF6A00' },
        { id: 'ali-modelstudio', type: 'ali-modelstudio', provider: 'alibaba', category: 'AI & ML', name: 'Model Studio', description: 'AI model development', icon: 'Sparkles', color: '#FF6A00' },
      ],
    },
    {
      name: 'Monitoring',
      components: [
        { id: 'ali-cloudmonitor', type: 'ali-cloudmonitor', provider: 'alibaba', category: 'Monitoring', name: 'CloudMonitor', description: 'Resource monitoring', icon: 'MonitorDot', color: '#FF6A00' },
        { id: 'ali-arms', type: 'ali-arms', provider: 'alibaba', category: 'Monitoring', name: 'ARMS', description: 'Application real-time monitoring', icon: 'Activity', color: '#FF6A00' },
        { id: 'ali-sls', type: 'ali-sls', provider: 'alibaba', category: 'Monitoring', name: 'SLS', description: 'Log service', icon: 'ScrollText', color: '#FF6A00' },
      ],
    },
    {
      name: 'Infrastructure Groups',
      components: [
        { id: 'ali-region', type: 'ali-region', provider: 'alibaba', category: 'Infrastructure Groups', name: 'Alibaba Region', description: 'Region boundary', icon: 'Globe', color: '#FF6A00' },
        { id: 'ali-vpc-group', type: 'ali-vpc-group', provider: 'alibaba', category: 'Infrastructure Groups', name: 'VPC', description: 'VPC boundary', icon: 'Network', color: '#FF6A00' },
        { id: 'ali-vswitch', type: 'ali-vswitch', provider: 'alibaba', category: 'Infrastructure Groups', name: 'VSwitch', description: 'VSwitch (subnet) boundary', icon: 'Lock', color: '#FF6A00' },
        { id: 'ali-az', type: 'ali-az', provider: 'alibaba', category: 'Infrastructure Groups', name: 'Availability Zone', description: 'AZ boundary', icon: 'Server', color: '#FF6A00' },
      ],
    },
  ],
};
