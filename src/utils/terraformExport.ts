import type { CanvasNode, CanvasEdge, CloudNodeData, GroupNodeData } from '../types';

interface ResourceMapEntry {
  type: string;
  args: string;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'resource';

const RESOURCE_MAP: Record<string, ResourceMapEntry> = {
  // ── AWS ──────────────────────────────────────────────
  'aws-ec2': { type: 'aws_instance', args: 'ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t3.micro"' },
  'aws-lambda': { type: 'aws_lambda_function', args: 'function_name = "{name}"\n  role          = aws_iam_role.lambda.arn\n  handler       = "index.handler"\n  runtime       = "nodejs20.x"' },
  'aws-ecs': { type: 'aws_ecs_cluster', args: 'name = "{name}"' },
  'aws-eks': { type: 'aws_eks_cluster', args: 'name     = "{name}"\n  role_arn = aws_iam_role.eks.arn\n  vpc_config { subnet_ids = [] }' },
  'aws-fargate': { type: 'aws_ecs_service', args: 'name            = "{name}"\n  launch_type     = "FARGATE"\n  desired_count   = 1' },
  'aws-batch': { type: 'aws_batch_compute_environment', args: 'compute_environment_name = "{name}"\n  type                     = "MANAGED"' },
  'aws-lightsail': { type: 'aws_lightsail_instance', args: 'name              = "{name}"\n  availability_zone = "us-east-1a"\n  blueprint_id      = "amazon_linux_2"\n  bundle_id         = "nano_2_0"' },

  'aws-s3': { type: 'aws_s3_bucket', args: 'bucket = "{name}"' },
  'aws-ebs': { type: 'aws_ebs_volume', args: 'availability_zone = "us-east-1a"\n  size              = 20' },
  'aws-efs': { type: 'aws_efs_file_system', args: 'tags = { Name = "{label}" }' },
  'aws-glacier': { type: 'aws_glacier_vault', args: 'name = "{name}"' },

  'aws-rds': { type: 'aws_db_instance', args: 'allocated_storage = 20\n  engine            = "postgres"\n  instance_class    = "db.t3.micro"\n  username          = "admin"\n  password          = var.db_password' },
  'aws-aurora': { type: 'aws_rds_cluster', args: 'cluster_identifier = "{name}"\n  engine             = "aurora-postgresql"\n  master_username    = "admin"\n  master_password    = var.db_password' },
  'aws-dynamodb': { type: 'aws_dynamodb_table', args: 'name           = "{name}"\n  billing_mode   = "PAY_PER_REQUEST"\n  hash_key       = "id"\n  attribute { name = "id" type = "S" }' },
  'aws-elasticache': { type: 'aws_elasticache_cluster', args: 'cluster_id      = "{name}"\n  engine          = "redis"\n  node_type       = "cache.t3.micro"\n  num_cache_nodes = 1' },
  'aws-redshift': { type: 'aws_redshift_cluster', args: 'cluster_identifier = "{name}"\n  database_name      = "main"\n  master_username    = "admin"\n  master_password    = var.db_password\n  node_type          = "ra3.xlplus"\n  cluster_type       = "single-node"' },

  'aws-sqs': { type: 'aws_sqs_queue', args: 'name = "{name}"' },
  'aws-sns': { type: 'aws_sns_topic', args: 'name = "{name}"' },
  'aws-eventbridge': { type: 'aws_cloudwatch_event_bus', args: 'name = "{name}"' },
  'aws-kinesis': { type: 'aws_kinesis_stream', args: 'name        = "{name}"\n  shard_count = 1' },
  'aws-mq': { type: 'aws_mq_broker', args: 'broker_name        = "{name}"\n  engine_type        = "RabbitMQ"\n  engine_version     = "3.11"\n  host_instance_type = "mq.t3.micro"' },
  'aws-msk': { type: 'aws_msk_cluster', args: 'cluster_name           = "{name}"\n  kafka_version          = "3.5.1"\n  number_of_broker_nodes = 3' },
  'aws-iot-core': { type: 'aws_iot_thing', args: 'name = "{name}"' },
  'aws-stepfunctions': { type: 'aws_sfn_state_machine', args: 'name     = "{name}"\n  role_arn = aws_iam_role.sfn.arn\n  definition = "{}"' },

  'aws-vpc': { type: 'aws_vpc', args: 'cidr_block = "10.0.0.0/16"' },
  'aws-subnet-public': { type: 'aws_subnet', args: 'vpc_id     = aws_vpc.main.id\n  cidr_block = "10.0.1.0/24"\n  map_public_ip_on_launch = true' },
  'aws-subnet-private': { type: 'aws_subnet', args: 'vpc_id     = aws_vpc.main.id\n  cidr_block = "10.0.2.0/24"' },
  'aws-alb': { type: 'aws_lb', args: 'name               = "{name}"\n  load_balancer_type = "application"\n  internal           = false' },
  'aws-nlb': { type: 'aws_lb', args: 'name               = "{name}"\n  load_balancer_type = "network"' },
  'aws-cloudfront': { type: 'aws_cloudfront_distribution', args: 'enabled = true\n  default_cache_behavior { target_origin_id = "default" allowed_methods = ["GET","HEAD"] cached_methods = ["GET","HEAD"] viewer_protocol_policy = "redirect-to-https" }' },
  'aws-route53': { type: 'aws_route53_zone', args: 'name = "example.com"' },
  'aws-apigateway': { type: 'aws_api_gateway_rest_api', args: 'name = "{name}"' },
  'aws-natgateway': { type: 'aws_nat_gateway', args: 'allocation_id = aws_eip.nat.id\n  subnet_id     = aws_subnet.public.id' },

  'aws-iam': { type: 'aws_iam_role', args: 'name               = "{name}"\n  assume_role_policy = "{}"' },
  'aws-kms': { type: 'aws_kms_key', args: 'description = "{label}"' },
  'aws-secrets': { type: 'aws_secretsmanager_secret', args: 'name = "{name}"' },
  'aws-waf': { type: 'aws_wafv2_web_acl', args: 'name  = "{name}"\n  scope = "REGIONAL"\n  default_action { allow {} }\n  visibility_config { cloudwatch_metrics_enabled = true metric_name = "{name}" sampled_requests_enabled = true }' },

  // ── Azure ────────────────────────────────────────────
  'azure-vm': { type: 'azurerm_linux_virtual_machine', args: 'name                = "{name}"\n  resource_group_name = azurerm_resource_group.main.name\n  location            = azurerm_resource_group.main.location\n  size                = "Standard_B1s"\n  admin_username      = "azureuser"' },
  'azure-functions': { type: 'azurerm_linux_function_app', args: 'name                = "{name}"\n  resource_group_name = azurerm_resource_group.main.name\n  location            = azurerm_resource_group.main.location\n  service_plan_id     = azurerm_service_plan.main.id\n  storage_account_name = azurerm_storage_account.main.name' },
  'azure-aks': { type: 'azurerm_kubernetes_cluster', args: 'name                = "{name}"\n  resource_group_name = azurerm_resource_group.main.name\n  location            = azurerm_resource_group.main.location\n  dns_prefix          = "{name}"' },
  'azure-blob': { type: 'azurerm_storage_account', args: 'name                     = "{name}"\n  resource_group_name      = azurerm_resource_group.main.name\n  location                 = azurerm_resource_group.main.location\n  account_tier             = "Standard"\n  account_replication_type = "LRS"' },
  'azure-sql': { type: 'azurerm_mssql_server', args: 'name                         = "{name}"\n  resource_group_name          = azurerm_resource_group.main.name\n  location                     = azurerm_resource_group.main.location\n  version                      = "12.0"\n  administrator_login          = "sqladmin"\n  administrator_login_password = var.db_password' },
  'azure-cosmosdb': { type: 'azurerm_cosmosdb_account', args: 'name                = "{name}"\n  resource_group_name = azurerm_resource_group.main.name\n  location            = azurerm_resource_group.main.location\n  offer_type          = "Standard"\n  kind                = "GlobalDocumentDB"' },
  'azure-vnet': { type: 'azurerm_virtual_network', args: 'name                = "{name}"\n  resource_group_name = azurerm_resource_group.main.name\n  location            = azurerm_resource_group.main.location\n  address_space       = ["10.0.0.0/16"]' },
  'azure-servicebus': { type: 'azurerm_servicebus_namespace', args: 'name                = "{name}"\n  resource_group_name = azurerm_resource_group.main.name\n  location            = azurerm_resource_group.main.location\n  sku                 = "Standard"' },
  'azure-eventhubs': { type: 'azurerm_eventhub_namespace', args: 'name                = "{name}"\n  resource_group_name = azurerm_resource_group.main.name\n  location            = azurerm_resource_group.main.location\n  sku                 = "Standard"\n  capacity            = 1' },

  // ── GCP ──────────────────────────────────────────────
  'gcp-compute': { type: 'google_compute_instance', args: 'name         = "{name}"\n  machine_type = "e2-medium"\n  zone         = "us-central1-a"\n  boot_disk { initialize_params { image = "debian-cloud/debian-12" } }\n  network_interface { network = "default" access_config {} }' },
  'gcp-functions': { type: 'google_cloudfunctions2_function', args: 'name     = "{name}"\n  location = "us-central1"\n  build_config { runtime = "nodejs20" entry_point = "handler" }' },
  'gcp-gke': { type: 'google_container_cluster', args: 'name               = "{name}"\n  location           = "us-central1"\n  initial_node_count = 1' },
  'gcp-cloudrun': { type: 'google_cloud_run_v2_service', args: 'name     = "{name}"\n  location = "us-central1"\n  template { containers { image = "us-docker.pkg.dev/cloudrun/container/hello" } }' },
  'gcp-cloudstorage': { type: 'google_storage_bucket', args: 'name     = "{name}"\n  location = "US"' },
  'gcp-cloudsql': { type: 'google_sql_database_instance', args: 'name             = "{name}"\n  database_version = "POSTGRES_15"\n  region           = "us-central1"\n  settings { tier = "db-f1-micro" }' },
  'gcp-firestore': { type: 'google_firestore_database', args: 'name        = "{name}"\n  location_id = "nam5"\n  type        = "FIRESTORE_NATIVE"' },
  'gcp-bigquery': { type: 'google_bigquery_dataset', args: 'dataset_id = "{name}"\n  location   = "US"' },
  'gcp-pubsub': { type: 'google_pubsub_topic', args: 'name = "{name}"' },
  'gcp-vpc': { type: 'google_compute_network', args: 'name                    = "{name}"\n  auto_create_subnetworks = false' },

  // ── Generic fallbacks ────────────────────────────────
  'gen-server': { type: 'aws_instance', args: 'ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t3.micro"' },
  'gen-container': { type: 'docker_container', args: 'name  = "{name}"\n  image = "nginx:latest"' },
  'gen-serverless': { type: 'aws_lambda_function', args: 'function_name = "{name}"\n  role          = aws_iam_role.lambda.arn\n  handler       = "index.handler"\n  runtime       = "nodejs20.x"' },
  'gen-kubernetes': { type: 'kubernetes_namespace', args: 'metadata { name = "{name}" }' },
  'gen-objectstorage': { type: 'aws_s3_bucket', args: 'bucket = "{name}"' },
  'gen-sqldb': { type: 'aws_db_instance', args: 'allocated_storage = 20\n  engine            = "postgres"\n  instance_class    = "db.t3.micro"\n  username          = "admin"\n  password          = var.db_password' },
  'gen-nosqldb': { type: 'aws_dynamodb_table', args: 'name         = "{name}"\n  billing_mode = "PAY_PER_REQUEST"\n  hash_key     = "id"\n  attribute { name = "id" type = "S" }' },
  'gen-cache': { type: 'aws_elasticache_cluster', args: 'cluster_id      = "{name}"\n  engine          = "redis"\n  node_type       = "cache.t3.micro"\n  num_cache_nodes = 1' },
  'gen-loadbalancer': { type: 'aws_lb', args: 'name               = "{name}"\n  load_balancer_type = "application"' },
  'gen-vpc': { type: 'aws_vpc', args: 'cidr_block = "10.0.0.0/16"' },
  'gen-subnet-public': { type: 'aws_subnet', args: 'vpc_id     = aws_vpc.main.id\n  cidr_block = "10.0.1.0/24"' },
  'gen-subnet-private': { type: 'aws_subnet', args: 'vpc_id     = aws_vpc.main.id\n  cidr_block = "10.0.2.0/24"' },
  'gen-kafka': { type: 'aws_msk_cluster', args: 'cluster_name           = "{name}"\n  kafka_version          = "3.5.1"\n  number_of_broker_nodes = 3' },
};

const PROVIDER_BLOCKS: Record<string, string> = {
  aws: `provider "aws" {
  region = "us-east-1"
}`,
  azure: `provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "rg-main"
  location = "East US"
}`,
  gcp: `provider "google" {
  project = "your-project-id"
  region  = "us-central1"
}`,
};

const REQUIRED_PROVIDER_LINES: Record<string, string> = {
  aws: 'aws     = { source = "hashicorp/aws",     version = "~> 5.0" }',
  azure: 'azurerm = { source = "hashicorp/azurerm", version = "~> 3.0" }',
  gcp: 'google  = { source = "hashicorp/google",  version = "~> 5.0" }',
};

function applyTemplate(template: string, name: string, label: string) {
  return template.replace(/\{name\}/g, name).replace(/\{label\}/g, label.replace(/"/g, '\\"'));
}

function nodeResource(node: CanvasNode): { tfName: string; provider: string; block: string } | null {
  if (node.type === 'textNode') return null;

  const isGroup = node.type === 'groupNode';
  const data = node.data as Partial<CloudNodeData & GroupNodeData>;
  const component = data.component;
  const componentType = component?.type;
  const provider = (component?.provider || data.provider || 'generic') as string;
  const label = (data.label as string) || component?.name || node.id;
  const tfName = slug(label);

  if (!componentType) {
    return {
      tfName,
      provider,
      block: `# ── ${label} (${isGroup ? 'group' : 'unmapped'}) ──\n# No Terraform mapping for this node — add manually.\n`,
    };
  }

  const mapping = RESOURCE_MAP[componentType];
  if (!mapping) {
    return {
      tfName,
      provider,
      block: `# ── ${label} (${componentType}) ──\n# No Terraform mapping yet. Add a resource here for "${componentType}".\n`,
    };
  }

  const args = applyTemplate(mapping.args, tfName, label);
  const indented = args
    .split('\n')
    .map((l) => (l.startsWith('  ') ? l : `  ${l}`))
    .join('\n');

  const block = `# ── ${label} ──
resource "${mapping.type}" "${tfName}" {
${indented}
  tags = {
    Name      = "${label.replace(/"/g, '\\"')}"
    ManagedBy = "terraform"
  }
}
`;

  return { tfName, provider, block };
}

export function generateTerraform(nodes: CanvasNode[], edges: CanvasEdge[]): string {
  const blocks: string[] = [];
  const providersUsed = new Set<string>();
  const nodeRefs = new Map<string, { tfName: string; type: string }>();

  for (const node of nodes) {
    const r = nodeResource(node);
    if (!r) continue;
    blocks.push(r.block);
    if (r.provider in PROVIDER_BLOCKS) providersUsed.add(r.provider);

    const data = node.data as Partial<CloudNodeData>;
    const componentType = data.component?.type;
    const mapping = componentType ? RESOURCE_MAP[componentType] : undefined;
    if (mapping) nodeRefs.set(node.id, { tfName: r.tfName, type: mapping.type });
  }

  const edgeComments: string[] = [];
  for (const edge of edges) {
    const src = nodeRefs.get(edge.source);
    const tgt = nodeRefs.get(edge.target);
    if (!src || !tgt) continue;
    const protocol = (edge.data?.protocol as string) || (typeof edge.label === 'string' ? edge.label : 'connection');
    edgeComments.push(`# ${src.type}.${src.tfName} -> ${tgt.type}.${tgt.tfName}  (${protocol})`);
  }

  const requiredProviders = Array.from(providersUsed)
    .filter((p) => REQUIRED_PROVIDER_LINES[p])
    .map((p) => `    ${REQUIRED_PROVIDER_LINES[p]}`)
    .join('\n');

  const providerBlocks = Array.from(providersUsed)
    .filter((p) => PROVIDER_BLOCKS[p])
    .map((p) => PROVIDER_BLOCKS[p])
    .join('\n\n');

  const header = `# ─────────────────────────────────────────────────────────────
# Generated by CloudInfra
# ${nodes.length} resources, ${edges.length} connections
# Generated at ${new Date().toISOString()}
#
# This is a starting skeleton. Review every resource —
# values like AMI IDs, regions, and passwords are placeholders.
# ─────────────────────────────────────────────────────────────

terraform {
  required_version = ">= 1.5.0"
${requiredProviders ? `  required_providers {\n${requiredProviders}\n  }` : ''}
}

${providerBlocks}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
  default     = "change-me-immediately"
}
`;

  const connectionsSection = edgeComments.length
    ? `\n# ── Connections ──\n# These are documented as comments. Wire them up via security groups,\n# IAM policies, or VPC peering as appropriate for your design.\n${edgeComments.join('\n')}\n`
    : '';

  return [header, ...blocks, connectionsSection].join('\n');
}
