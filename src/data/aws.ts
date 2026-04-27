import type { ProviderLibrary } from '../types';

export const awsLibrary: ProviderLibrary = {
  provider: 'aws',
  label: 'Amazon Web Services',
  color: '#FF9900',
  categories: [
    {
      name: 'Compute',
      components: [
        { id: 'aws-ec2', type: 'aws-ec2', provider: 'aws', category: 'Compute', name: 'EC2', description: 'Virtual servers in the cloud', icon: 'Server', color: '#FF9900' },
        { id: 'aws-lambda', type: 'aws-lambda', provider: 'aws', category: 'Compute', name: 'Lambda', description: 'Serverless compute service', icon: 'Zap', color: '#FF9900' },
        { id: 'aws-ecs', type: 'aws-ecs', provider: 'aws', category: 'Compute', name: 'ECS', description: 'Container orchestration service', icon: 'Container', color: '#FF9900' },
        { id: 'aws-eks', type: 'aws-eks', provider: 'aws', category: 'Compute', name: 'EKS', description: 'Managed Kubernetes service', icon: 'Box', color: '#FF9900' },
        { id: 'aws-fargate', type: 'aws-fargate', provider: 'aws', category: 'Compute', name: 'Fargate', description: 'Serverless containers', icon: 'Cloud', color: '#FF9900' },
        { id: 'aws-batch', type: 'aws-batch', provider: 'aws', category: 'Compute', name: 'Batch', description: 'Batch computing jobs', icon: 'Layers', color: '#FF9900' },
        { id: 'aws-lightsail', type: 'aws-lightsail', provider: 'aws', category: 'Compute', name: 'Lightsail', description: 'Simple virtual private servers', icon: 'Lightbulb', color: '#FF9900' },
        { id: 'aws-elasticbeanstalk', type: 'aws-elasticbeanstalk', provider: 'aws', category: 'Compute', name: 'Elastic Beanstalk', description: 'PaaS for web apps', icon: 'Rocket', color: '#FF9900' },
      ],
    },
    {
      name: 'Storage',
      components: [
        { id: 'aws-s3', type: 'aws-s3', provider: 'aws', category: 'Storage', name: 'S3', description: 'Object storage service', icon: 'HardDrive', color: '#3F8624' },
        { id: 'aws-ebs', type: 'aws-ebs', provider: 'aws', category: 'Storage', name: 'EBS', description: 'Block storage volumes', icon: 'Database', color: '#3F8624' },
        { id: 'aws-efs', type: 'aws-efs', provider: 'aws', category: 'Storage', name: 'EFS', description: 'Elastic file system', icon: 'FolderOpen', color: '#3F8624' },
        { id: 'aws-glacier', type: 'aws-glacier', provider: 'aws', category: 'Storage', name: 'S3 Glacier', description: 'Archive storage', icon: 'Archive', color: '#3F8624' },
        { id: 'aws-fsx', type: 'aws-fsx', provider: 'aws', category: 'Storage', name: 'FSx', description: 'Managed file systems', icon: 'FileStack', color: '#3F8624' },
      ],
    },
    {
      name: 'Database',
      components: [
        { id: 'aws-rds', type: 'aws-rds', provider: 'aws', category: 'Database', name: 'RDS', description: 'Managed relational database', icon: 'Database', color: '#3B48CC' },
        { id: 'aws-dynamodb', type: 'aws-dynamodb', provider: 'aws', category: 'Database', name: 'DynamoDB', description: 'NoSQL key-value database', icon: 'Table', color: '#3B48CC' },
        { id: 'aws-aurora', type: 'aws-aurora', provider: 'aws', category: 'Database', name: 'Aurora', description: 'High-performance relational DB', icon: 'Database', color: '#3B48CC' },
        { id: 'aws-elasticache', type: 'aws-elasticache', provider: 'aws', category: 'Database', name: 'ElastiCache', description: 'In-memory cache (Redis/Memcached)', icon: 'Cpu', color: '#3B48CC' },
        { id: 'aws-redshift', type: 'aws-redshift', provider: 'aws', category: 'Database', name: 'Redshift', description: 'Data warehouse', icon: 'BarChart3', color: '#3B48CC' },
        { id: 'aws-neptune', type: 'aws-neptune', provider: 'aws', category: 'Database', name: 'Neptune', description: 'Graph database', icon: 'GitBranch', color: '#3B48CC' },
        { id: 'aws-documentdb', type: 'aws-documentdb', provider: 'aws', category: 'Database', name: 'DocumentDB', description: 'MongoDB-compatible document DB', icon: 'FileText', color: '#3B48CC' },
      ],
    },
    {
      name: 'Networking',
      components: [
        { id: 'aws-vpc', type: 'aws-vpc', provider: 'aws', category: 'Networking', name: 'VPC', description: 'Virtual private cloud', icon: 'Network', color: '#8C4FFF' },
        { id: 'aws-route53', type: 'aws-route53', provider: 'aws', category: 'Networking', name: 'Route 53', description: 'DNS web service', icon: 'Globe', color: '#8C4FFF' },
        { id: 'aws-cloudfront', type: 'aws-cloudfront', provider: 'aws', category: 'Networking', name: 'CloudFront', description: 'Content delivery network', icon: 'Radio', color: '#8C4FFF' },
        { id: 'aws-apigateway', type: 'aws-apigateway', provider: 'aws', category: 'Networking', name: 'API Gateway', description: 'API management service', icon: 'ArrowLeftRight', color: '#8C4FFF' },
        { id: 'aws-elb', type: 'aws-elb', provider: 'aws', category: 'Networking', name: 'ELB', description: 'Elastic load balancer', icon: 'Split', color: '#8C4FFF' },
        { id: 'aws-directconnect', type: 'aws-directconnect', provider: 'aws', category: 'Networking', name: 'Direct Connect', description: 'Dedicated network connection', icon: 'Cable', color: '#8C4FFF' },
        { id: 'aws-transitgateway', type: 'aws-transitgateway', provider: 'aws', category: 'Networking', name: 'Transit Gateway', description: 'Network transit hub', icon: 'Waypoints', color: '#8C4FFF' },
      ],
    },
    {
      name: 'Security',
      components: [
        { id: 'aws-iam', type: 'aws-iam', provider: 'aws', category: 'Security', name: 'IAM', description: 'Identity and access management', icon: 'Shield', color: '#DD344C' },
        { id: 'aws-cognito', type: 'aws-cognito', provider: 'aws', category: 'Security', name: 'Cognito', description: 'User authentication service', icon: 'UserCheck', color: '#DD344C' },
        { id: 'aws-waf', type: 'aws-waf', provider: 'aws', category: 'Security', name: 'WAF', description: 'Web application firewall', icon: 'ShieldAlert', color: '#DD344C' },
        { id: 'aws-kms', type: 'aws-kms', provider: 'aws', category: 'Security', name: 'KMS', description: 'Key management service', icon: 'Key', color: '#DD344C' },
        { id: 'aws-secretsmanager', type: 'aws-secretsmanager', provider: 'aws', category: 'Security', name: 'Secrets Manager', description: 'Secrets management', icon: 'Lock', color: '#DD344C' },
        { id: 'aws-guardduty', type: 'aws-guardduty', provider: 'aws', category: 'Security', name: 'GuardDuty', description: 'Threat detection', icon: 'Eye', color: '#DD344C' },
      ],
    },
    {
      name: 'Messaging',
      components: [
        { id: 'aws-sqs', type: 'aws-sqs', provider: 'aws', category: 'Messaging', name: 'SQS', description: 'Message queue service', icon: 'MailOpen', color: '#E7157B' },
        { id: 'aws-sns', type: 'aws-sns', provider: 'aws', category: 'Messaging', name: 'SNS', description: 'Pub/Sub notification service', icon: 'Bell', color: '#E7157B' },
        { id: 'aws-eventbridge', type: 'aws-eventbridge', provider: 'aws', category: 'Messaging', name: 'EventBridge', description: 'Serverless event bus', icon: 'Workflow', color: '#E7157B' },
        { id: 'aws-kinesis', type: 'aws-kinesis', provider: 'aws', category: 'Messaging', name: 'Kinesis', description: 'Real-time data streaming', icon: 'Activity', color: '#E7157B' },
        { id: 'aws-mq', type: 'aws-mq', provider: 'aws', category: 'Messaging', name: 'Amazon MQ', description: 'Managed message broker', icon: 'MessageSquare', color: '#E7157B' },
        { id: 'aws-stepfunctions', type: 'aws-stepfunctions', provider: 'aws', category: 'Messaging', name: 'Step Functions', description: 'Serverless workflow orchestration', icon: 'GitMerge', color: '#E7157B' },
      ],
    },
    {
      name: 'DevOps',
      components: [
        { id: 'aws-codepipeline', type: 'aws-codepipeline', provider: 'aws', category: 'DevOps', name: 'CodePipeline', description: 'CI/CD pipeline service', icon: 'GitBranch', color: '#3B48CC' },
        { id: 'aws-codebuild', type: 'aws-codebuild', provider: 'aws', category: 'DevOps', name: 'CodeBuild', description: 'Build service', icon: 'Hammer', color: '#3B48CC' },
        { id: 'aws-cloudformation', type: 'aws-cloudformation', provider: 'aws', category: 'DevOps', name: 'CloudFormation', description: 'Infrastructure as code', icon: 'FileCode', color: '#3B48CC' },
        { id: 'aws-ecr', type: 'aws-ecr', provider: 'aws', category: 'DevOps', name: 'ECR', description: 'Container registry', icon: 'Package', color: '#3B48CC' },
      ],
    },
    {
      name: 'AI & ML',
      components: [
        { id: 'aws-sagemaker', type: 'aws-sagemaker', provider: 'aws', category: 'AI & ML', name: 'SageMaker', description: 'ML model building & deployment', icon: 'Brain', color: '#01A88D' },
        { id: 'aws-bedrock', type: 'aws-bedrock', provider: 'aws', category: 'AI & ML', name: 'Bedrock', description: 'Foundation model service', icon: 'Sparkles', color: '#01A88D' },
        { id: 'aws-rekognition', type: 'aws-rekognition', provider: 'aws', category: 'AI & ML', name: 'Rekognition', description: 'Image & video analysis', icon: 'ScanFace', color: '#01A88D' },
        { id: 'aws-comprehend', type: 'aws-comprehend', provider: 'aws', category: 'AI & ML', name: 'Comprehend', description: 'NLP service', icon: 'Languages', color: '#01A88D' },
      ],
    },
    {
      name: 'Monitoring',
      components: [
        { id: 'aws-cloudwatch', type: 'aws-cloudwatch', provider: 'aws', category: 'Monitoring', name: 'CloudWatch', description: 'Monitoring & observability', icon: 'MonitorDot', color: '#E7157B' },
        { id: 'aws-xray', type: 'aws-xray', provider: 'aws', category: 'Monitoring', name: 'X-Ray', description: 'Distributed tracing', icon: 'Search', color: '#E7157B' },
        { id: 'aws-cloudtrail', type: 'aws-cloudtrail', provider: 'aws', category: 'Monitoring', name: 'CloudTrail', description: 'API activity logging', icon: 'ScrollText', color: '#E7157B' },
      ],
    },
    {
      name: 'Infrastructure Groups',
      components: [
        { id: 'aws-region', type: 'aws-region', provider: 'aws', category: 'Infrastructure Groups', name: 'AWS Region', description: 'AWS region boundary (us-east-1, etc)', icon: 'Globe', color: '#FF9900' },
        { id: 'aws-vpc-group', type: 'aws-vpc-group', provider: 'aws', category: 'Infrastructure Groups', name: 'VPC', description: 'Virtual private cloud boundary', icon: 'Network', color: '#8C4FFF' },
        { id: 'aws-subnet-public', type: 'aws-subnet-public', provider: 'aws', category: 'Infrastructure Groups', name: 'Public Subnet', description: 'Public subnet', icon: 'Globe', color: '#3F8624' },
        { id: 'aws-subnet-private', type: 'aws-subnet-private', provider: 'aws', category: 'Infrastructure Groups', name: 'Private Subnet', description: 'Private subnet', icon: 'Lock', color: '#E7157B' },
        { id: 'aws-az', type: 'aws-az', provider: 'aws', category: 'Infrastructure Groups', name: 'Availability Zone', description: 'AZ boundary', icon: 'Server', color: '#3B48CC' },
        { id: 'aws-account', type: 'aws-account', provider: 'aws', category: 'Infrastructure Groups', name: 'AWS Account', description: 'Account boundary', icon: 'UserCheck', color: '#DD344C' },
      ],
    },
  ],
};

