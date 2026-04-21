import type { ProviderLibrary } from '../types';

export const azureLibrary: ProviderLibrary = {
  provider: 'azure',
  label: 'Microsoft Azure',
  color: '#0078D4',
  categories: [
    {
      name: 'Compute',
      components: [
        { id: 'azure-vm', type: 'azure-vm', provider: 'azure', category: 'Compute', name: 'Virtual Machine', description: 'Azure virtual machines', icon: 'Server', color: '#0078D4' },
        { id: 'azure-appservice', type: 'azure-appservice', provider: 'azure', category: 'Compute', name: 'App Service', description: 'Managed web app hosting', icon: 'Globe', color: '#0078D4' },
        { id: 'azure-aks', type: 'azure-aks', provider: 'azure', category: 'Compute', name: 'AKS', description: 'Managed Kubernetes', icon: 'Box', color: '#0078D4' },
        { id: 'azure-functions', type: 'azure-functions', provider: 'azure', category: 'Compute', name: 'Functions', description: 'Serverless compute', icon: 'Zap', color: '#0078D4' },
        { id: 'azure-containerinstances', type: 'azure-containerinstances', provider: 'azure', category: 'Compute', name: 'Container Instances', description: 'Serverless containers', icon: 'Container', color: '#0078D4' },
        { id: 'azure-containerapp', type: 'azure-containerapp', provider: 'azure', category: 'Compute', name: 'Container Apps', description: 'Managed container platform', icon: 'Layers', color: '#0078D4' },
      ],
    },
    {
      name: 'Storage',
      components: [
        { id: 'azure-blobstorage', type: 'azure-blobstorage', provider: 'azure', category: 'Storage', name: 'Blob Storage', description: 'Object storage for unstructured data', icon: 'HardDrive', color: '#0078D4' },
        { id: 'azure-files', type: 'azure-files', provider: 'azure', category: 'Storage', name: 'Azure Files', description: 'Managed file shares', icon: 'FolderOpen', color: '#0078D4' },
        { id: 'azure-datalake', type: 'azure-datalake', provider: 'azure', category: 'Storage', name: 'Data Lake', description: 'Big data storage', icon: 'Database', color: '#0078D4' },
        { id: 'azure-queue', type: 'azure-queue', provider: 'azure', category: 'Storage', name: 'Queue Storage', description: 'Message queue storage', icon: 'MailOpen', color: '#0078D4' },
      ],
    },
    {
      name: 'Database',
      components: [
        { id: 'azure-sqldb', type: 'azure-sqldb', provider: 'azure', category: 'Database', name: 'SQL Database', description: 'Managed SQL database', icon: 'Database', color: '#0078D4' },
        { id: 'azure-cosmosdb', type: 'azure-cosmosdb', provider: 'azure', category: 'Database', name: 'Cosmos DB', description: 'Multi-model NoSQL database', icon: 'Globe', color: '#0078D4' },
        { id: 'azure-postgresql', type: 'azure-postgresql', provider: 'azure', category: 'Database', name: 'PostgreSQL', description: 'Managed PostgreSQL', icon: 'Database', color: '#0078D4' },
        { id: 'azure-mysql', type: 'azure-mysql', provider: 'azure', category: 'Database', name: 'MySQL', description: 'Managed MySQL', icon: 'Database', color: '#0078D4' },
        { id: 'azure-redis', type: 'azure-redis', provider: 'azure', category: 'Database', name: 'Redis Cache', description: 'In-memory cache', icon: 'Cpu', color: '#0078D4' },
      ],
    },
    {
      name: 'Networking',
      components: [
        { id: 'azure-vnet', type: 'azure-vnet', provider: 'azure', category: 'Networking', name: 'VNet', description: 'Virtual network', icon: 'Network', color: '#0078D4' },
        { id: 'azure-loadbalancer', type: 'azure-loadbalancer', provider: 'azure', category: 'Networking', name: 'Load Balancer', description: 'Network load balancer', icon: 'Split', color: '#0078D4' },
        { id: 'azure-appgateway', type: 'azure-appgateway', provider: 'azure', category: 'Networking', name: 'Application Gateway', description: 'L7 load balancer with WAF', icon: 'Shield', color: '#0078D4' },
        { id: 'azure-frontdoor', type: 'azure-frontdoor', provider: 'azure', category: 'Networking', name: 'Front Door', description: 'Global load balancer & CDN', icon: 'Radio', color: '#0078D4' },
        { id: 'azure-dns', type: 'azure-dns', provider: 'azure', category: 'Networking', name: 'Azure DNS', description: 'DNS hosting service', icon: 'Globe', color: '#0078D4' },
        { id: 'azure-expressroute', type: 'azure-expressroute', provider: 'azure', category: 'Networking', name: 'ExpressRoute', description: 'Private connection to Azure', icon: 'Cable', color: '#0078D4' },
        { id: 'azure-apim', type: 'azure-apim', provider: 'azure', category: 'Networking', name: 'API Management', description: 'API gateway & management', icon: 'ArrowLeftRight', color: '#0078D4' },
      ],
    },
    {
      name: 'Security',
      components: [
        { id: 'azure-ad', type: 'azure-ad', provider: 'azure', category: 'Security', name: 'Entra ID', description: 'Identity & access management', icon: 'UserCheck', color: '#0078D4' },
        { id: 'azure-keyvault', type: 'azure-keyvault', provider: 'azure', category: 'Security', name: 'Key Vault', description: 'Secret & key management', icon: 'Key', color: '#0078D4' },
        { id: 'azure-sentinel', type: 'azure-sentinel', provider: 'azure', category: 'Security', name: 'Sentinel', description: 'SIEM & SOAR', icon: 'Eye', color: '#0078D4' },
        { id: 'azure-firewall', type: 'azure-firewall', provider: 'azure', category: 'Security', name: 'Firewall', description: 'Network firewall', icon: 'ShieldAlert', color: '#0078D4' },
      ],
    },
    {
      name: 'Messaging',
      components: [
        { id: 'azure-servicebus', type: 'azure-servicebus', provider: 'azure', category: 'Messaging', name: 'Service Bus', description: 'Enterprise message broker', icon: 'MailOpen', color: '#0078D4' },
        { id: 'azure-eventhubs', type: 'azure-eventhubs', provider: 'azure', category: 'Messaging', name: 'Event Hubs', description: 'Big data streaming', icon: 'Activity', color: '#0078D4' },
        { id: 'azure-eventgrid', type: 'azure-eventgrid', provider: 'azure', category: 'Messaging', name: 'Event Grid', description: 'Event routing service', icon: 'Workflow', color: '#0078D4' },
        { id: 'azure-signalr', type: 'azure-signalr', provider: 'azure', category: 'Messaging', name: 'SignalR', description: 'Real-time messaging', icon: 'MessageSquare', color: '#0078D4' },
      ],
    },
    {
      name: 'AI & ML',
      components: [
        { id: 'azure-openai', type: 'azure-openai', provider: 'azure', category: 'AI & ML', name: 'OpenAI Service', description: 'Azure OpenAI models', icon: 'Sparkles', color: '#0078D4' },
        { id: 'azure-cognitive', type: 'azure-cognitive', provider: 'azure', category: 'AI & ML', name: 'AI Services', description: 'Pre-built AI capabilities', icon: 'Brain', color: '#0078D4' },
        { id: 'azure-mlstudio', type: 'azure-mlstudio', provider: 'azure', category: 'AI & ML', name: 'ML Studio', description: 'ML model development', icon: 'FlaskConical', color: '#0078D4' },
      ],
    },
    {
      name: 'Monitoring',
      components: [
        { id: 'azure-monitor', type: 'azure-monitor', provider: 'azure', category: 'Monitoring', name: 'Monitor', description: 'Full-stack monitoring', icon: 'MonitorDot', color: '#0078D4' },
        { id: 'azure-appinsights', type: 'azure-appinsights', provider: 'azure', category: 'Monitoring', name: 'App Insights', description: 'Application performance monitoring', icon: 'Search', color: '#0078D4' },
        { id: 'azure-loganalytics', type: 'azure-loganalytics', provider: 'azure', category: 'Monitoring', name: 'Log Analytics', description: 'Log query and analysis', icon: 'ScrollText', color: '#0078D4' },
      ],
    },
    {
      name: 'Infrastructure Groups',
      components: [
        { id: 'azure-region', type: 'azure-region', provider: 'azure', category: 'Infrastructure Groups', name: 'Azure Region', description: 'Azure region boundary', icon: 'Globe', color: '#0078D4' },
        { id: 'azure-vnet-group', type: 'azure-vnet-group', provider: 'azure', category: 'Infrastructure Groups', name: 'VNet', description: 'Virtual network boundary', icon: 'Network', color: '#0078D4' },
        { id: 'azure-subnet-group', type: 'azure-subnet-group', provider: 'azure', category: 'Infrastructure Groups', name: 'Subnet', description: 'Subnet boundary', icon: 'Lock', color: '#0078D4' },
        { id: 'azure-rg', type: 'azure-rg', provider: 'azure', category: 'Infrastructure Groups', name: 'Resource Group', description: 'Resource group boundary', icon: 'FolderOpen', color: '#0078D4' },
        { id: 'azure-subscription', type: 'azure-subscription', provider: 'azure', category: 'Infrastructure Groups', name: 'Subscription', description: 'Azure subscription boundary', icon: 'UserCheck', color: '#0078D4' },
      ],
    },
  ],
};
