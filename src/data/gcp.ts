import type { ProviderLibrary } from '../types';

export const gcpLibrary: ProviderLibrary = {
  provider: 'gcp',
  label: 'Google Cloud Platform',
  color: '#4285F4',
  categories: [
    {
      name: 'Compute',
      components: [
        { id: 'gcp-computeengine', type: 'gcp-computeengine', provider: 'gcp', category: 'Compute', name: 'Compute Engine', description: 'Virtual machines', icon: 'Server', color: '#4285F4' },
        { id: 'gcp-cloudrun', type: 'gcp-cloudrun', provider: 'gcp', category: 'Compute', name: 'Cloud Run', description: 'Serverless containers', icon: 'Container', color: '#4285F4' },
        { id: 'gcp-gke', type: 'gcp-gke', provider: 'gcp', category: 'Compute', name: 'GKE', description: 'Managed Kubernetes', icon: 'Box', color: '#4285F4' },
        { id: 'gcp-cloudfunctions', type: 'gcp-cloudfunctions', provider: 'gcp', category: 'Compute', name: 'Cloud Functions', description: 'Serverless functions', icon: 'Zap', color: '#4285F4' },
        { id: 'gcp-appengine', type: 'gcp-appengine', provider: 'gcp', category: 'Compute', name: 'App Engine', description: 'Platform as a service', icon: 'Rocket', color: '#4285F4' },
      ],
    },
    {
      name: 'Storage',
      components: [
        { id: 'gcp-cloudstorage', type: 'gcp-cloudstorage', provider: 'gcp', category: 'Storage', name: 'Cloud Storage', description: 'Object storage', icon: 'HardDrive', color: '#4285F4' },
        { id: 'gcp-persistentdisk', type: 'gcp-persistentdisk', provider: 'gcp', category: 'Storage', name: 'Persistent Disk', description: 'Block storage', icon: 'Database', color: '#4285F4' },
        { id: 'gcp-filestore', type: 'gcp-filestore', provider: 'gcp', category: 'Storage', name: 'Filestore', description: 'Managed file storage', icon: 'FolderOpen', color: '#4285F4' },
      ],
    },
    {
      name: 'Database',
      components: [
        { id: 'gcp-cloudsql', type: 'gcp-cloudsql', provider: 'gcp', category: 'Database', name: 'Cloud SQL', description: 'Managed MySQL/PostgreSQL/SQL Server', icon: 'Database', color: '#4285F4' },
        { id: 'gcp-firestore', type: 'gcp-firestore', provider: 'gcp', category: 'Database', name: 'Firestore', description: 'NoSQL document database', icon: 'FileText', color: '#4285F4' },
        { id: 'gcp-bigtable', type: 'gcp-bigtable', provider: 'gcp', category: 'Database', name: 'Bigtable', description: 'Wide-column NoSQL database', icon: 'Table', color: '#4285F4' },
        { id: 'gcp-spanner', type: 'gcp-spanner', provider: 'gcp', category: 'Database', name: 'Spanner', description: 'Globally distributed relational DB', icon: 'Globe', color: '#4285F4' },
        { id: 'gcp-memorystore', type: 'gcp-memorystore', provider: 'gcp', category: 'Database', name: 'Memorystore', description: 'In-memory data store (Redis)', icon: 'Cpu', color: '#4285F4' },
        { id: 'gcp-bigquery', type: 'gcp-bigquery', provider: 'gcp', category: 'Database', name: 'BigQuery', description: 'Serverless data warehouse', icon: 'BarChart3', color: '#4285F4' },
      ],
    },
    {
      name: 'Networking',
      components: [
        { id: 'gcp-vpc', type: 'gcp-vpc', provider: 'gcp', category: 'Networking', name: 'VPC', description: 'Virtual private cloud', icon: 'Network', color: '#4285F4' },
        { id: 'gcp-loadbalancing', type: 'gcp-loadbalancing', provider: 'gcp', category: 'Networking', name: 'Cloud Load Balancing', description: 'Global load balancer', icon: 'Split', color: '#4285F4' },
        { id: 'gcp-cdn', type: 'gcp-cdn', provider: 'gcp', category: 'Networking', name: 'Cloud CDN', description: 'Content delivery network', icon: 'Radio', color: '#4285F4' },
        { id: 'gcp-dns', type: 'gcp-dns', provider: 'gcp', category: 'Networking', name: 'Cloud DNS', description: 'Domain name system', icon: 'Globe', color: '#4285F4' },
        { id: 'gcp-armor', type: 'gcp-armor', provider: 'gcp', category: 'Networking', name: 'Cloud Armor', description: 'DDoS protection & WAF', icon: 'ShieldAlert', color: '#4285F4' },
        { id: 'gcp-apigateway', type: 'gcp-apigateway', provider: 'gcp', category: 'Networking', name: 'API Gateway', description: 'API management', icon: 'ArrowLeftRight', color: '#4285F4' },
      ],
    },
    {
      name: 'Security',
      components: [
        { id: 'gcp-iam', type: 'gcp-iam', provider: 'gcp', category: 'Security', name: 'IAM', description: 'Identity & access management', icon: 'Shield', color: '#4285F4' },
        { id: 'gcp-secretmanager', type: 'gcp-secretmanager', provider: 'gcp', category: 'Security', name: 'Secret Manager', description: 'Secret storage', icon: 'Lock', color: '#4285F4' },
        { id: 'gcp-scc', type: 'gcp-scc', provider: 'gcp', category: 'Security', name: 'Security Command Center', description: 'Security management', icon: 'Eye', color: '#4285F4' },
      ],
    },
    {
      name: 'Messaging',
      components: [
        { id: 'gcp-pubsub', type: 'gcp-pubsub', provider: 'gcp', category: 'Messaging', name: 'Pub/Sub', description: 'Messaging & event ingestion', icon: 'MailOpen', color: '#4285F4' },
        { id: 'gcp-cloudtasks', type: 'gcp-cloudtasks', provider: 'gcp', category: 'Messaging', name: 'Cloud Tasks', description: 'Asynchronous task execution', icon: 'Workflow', color: '#4285F4' },
        { id: 'gcp-dataflow', type: 'gcp-dataflow', provider: 'gcp', category: 'Messaging', name: 'Dataflow', description: 'Stream & batch data processing', icon: 'Activity', color: '#4285F4' },
      ],
    },
    {
      name: 'AI & ML',
      components: [
        { id: 'gcp-vertexai', type: 'gcp-vertexai', provider: 'gcp', category: 'AI & ML', name: 'Vertex AI', description: 'ML platform', icon: 'Brain', color: '#4285F4' },
        { id: 'gcp-automl', type: 'gcp-automl', provider: 'gcp', category: 'AI & ML', name: 'AutoML', description: 'Automated machine learning', icon: 'Sparkles', color: '#4285F4' },
        { id: 'gcp-visionai', type: 'gcp-visionai', provider: 'gcp', category: 'AI & ML', name: 'Vision AI', description: 'Image analysis', icon: 'ScanFace', color: '#4285F4' },
      ],
    },
    {
      name: 'Monitoring',
      components: [
        { id: 'gcp-cloudmonitoring', type: 'gcp-cloudmonitoring', provider: 'gcp', category: 'Monitoring', name: 'Cloud Monitoring', description: 'Infrastructure monitoring', icon: 'MonitorDot', color: '#4285F4' },
        { id: 'gcp-cloudlogging', type: 'gcp-cloudlogging', provider: 'gcp', category: 'Monitoring', name: 'Cloud Logging', description: 'Log management', icon: 'ScrollText', color: '#4285F4' },
        { id: 'gcp-cloudtrace', type: 'gcp-cloudtrace', provider: 'gcp', category: 'Monitoring', name: 'Cloud Trace', description: 'Distributed tracing', icon: 'Search', color: '#4285F4' },
      ],
    },
    {
      name: 'DevOps',
      components: [
        { id: 'gcp-cloudbuild', type: 'gcp-cloudbuild', provider: 'gcp', category: 'DevOps', name: 'Cloud Build', description: 'CI/CD platform', icon: 'Hammer', color: '#4285F4' },
        { id: 'gcp-artifactregistry', type: 'gcp-artifactregistry', provider: 'gcp', category: 'DevOps', name: 'Artifact Registry', description: 'Container & package registry', icon: 'Package', color: '#4285F4' },
        { id: 'gcp-clouddeploy', type: 'gcp-clouddeploy', provider: 'gcp', category: 'DevOps', name: 'Cloud Deploy', description: 'Continuous delivery', icon: 'Rocket', color: '#4285F4' },
      ],
    },
    {
      name: 'Infrastructure Groups',
      components: [
        { id: 'gcp-region', type: 'gcp-region', provider: 'gcp', category: 'Infrastructure Groups', name: 'GCP Region', description: 'GCP region boundary', icon: 'Globe', color: '#4285F4' },
        { id: 'gcp-vpc-group', type: 'gcp-vpc-group', provider: 'gcp', category: 'Infrastructure Groups', name: 'VPC Network', description: 'VPC network boundary', icon: 'Network', color: '#4285F4' },
        { id: 'gcp-subnet-group', type: 'gcp-subnet-group', provider: 'gcp', category: 'Infrastructure Groups', name: 'Subnet', description: 'Subnet boundary', icon: 'Lock', color: '#4285F4' },
        { id: 'gcp-project', type: 'gcp-project', provider: 'gcp', category: 'Infrastructure Groups', name: 'GCP Project', description: 'Project boundary', icon: 'FolderOpen', color: '#4285F4' },
        { id: 'gcp-zone', type: 'gcp-zone', provider: 'gcp', category: 'Infrastructure Groups', name: 'Zone', description: 'Availability zone boundary', icon: 'Server', color: '#4285F4' },
      ],
    },
  ],
};
