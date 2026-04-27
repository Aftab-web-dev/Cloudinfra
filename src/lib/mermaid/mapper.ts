import { providerLibraries } from '../../data';
import type { CloudComponent } from '../../types';
import type { MermaidNode } from './parser';

interface ComponentIndex {
  byId: Map<string, CloudComponent>;
  byName: Map<string, CloudComponent>;
}

let cachedIndex: ComponentIndex | null = null;

function getIndex(): ComponentIndex {
  if (cachedIndex) return cachedIndex;
  const byId = new Map<string, CloudComponent>();
  const byName = new Map<string, CloudComponent>();
  for (const lib of Object.values(providerLibraries)) {
    for (const cat of lib.categories) {
      for (const comp of cat.components) {
        byId.set(comp.id.toLowerCase(), comp);
        byName.set(comp.name.toLowerCase(), comp);
      }
    }
  }
  cachedIndex = { byId, byName };
  return cachedIndex;
}

const KEYWORD_MAP: Record<string, string> = {
  // AWS
  ec2: 'aws-ec2',
  lambda: 'aws-lambda',
  s3: 'aws-s3',
  rds: 'aws-rds',
  dynamodb: 'aws-dynamodb',
  cloudfront: 'aws-cloudfront',
  sqs: 'aws-sqs',
  sns: 'aws-sns',
  cognito: 'aws-cognito',
  // Compute
  server: 'gen-server',
  app: 'gen-server',
  service: 'gen-server',
  backend: 'gen-server',
  frontend: 'gen-server',
  worker: 'gen-worker',
  function: 'gen-serverless',
  serverless: 'gen-serverless',
  faas: 'gen-serverless',
  container: 'gen-container',
  docker: 'gen-container',
  k8s: 'gen-kubernetes',
  kubernetes: 'gen-kubernetes',
  // Database
  database: 'gen-sqldb',
  db: 'gen-sqldb',
  sql: 'gen-sqldb',
  postgres: 'gen-sqldb',
  postgresql: 'gen-sqldb',
  mysql: 'gen-sqldb',
  mariadb: 'gen-sqldb',
  nosql: 'gen-nosqldb',
  mongodb: 'gen-nosqldb',
  mongo: 'gen-nosqldb',
  cache: 'gen-cache',
  redis: 'gen-cache',
  memcached: 'gen-cache',
  warehouse: 'gen-datawarehouse',
  datawarehouse: 'gen-datawarehouse',
  vector: 'gen-vectordb',
  graphdb: 'gen-graphdb',
  // Storage
  storage: 'gen-objectstorage',
  bucket: 'gen-objectstorage',
  objectstorage: 'gen-objectstorage',
  blockstorage: 'gen-blockstorage',
  filestorage: 'gen-filestorage',
  nfs: 'gen-filestorage',
  // Networking
  lb: 'gen-loadbalancer',
  loadbalancer: 'gen-loadbalancer',
  cdn: 'gen-cdn',
  dns: 'gen-dns',
  apigateway: 'gen-apigateway',
  api: 'gen-apigateway',
  gateway: 'gen-apigateway',
  firewall: 'gen-firewall',
  vpn: 'gen-vpn',
  proxy: 'gen-reverseproxy',
  nginx: 'gen-reverseproxy',
  haproxy: 'gen-reverseproxy',
  traefik: 'gen-reverseproxy',
  // Messaging
  queue: 'gen-messagequeue',
  mq: 'gen-messagequeue',
  rabbitmq: 'gen-messagequeue',
  kafka: 'gen-stream',
  eventbus: 'gen-eventbus',
  pubsub: 'gen-eventbus',
  stream: 'gen-stream',
  websocket: 'gen-websocket',
  ws: 'gen-websocket',
  // Clients
  user: 'gen-browser',
  users: 'gen-browser',
  client: 'gen-browser',
  browser: 'gen-browser',
  web: 'gen-browser',
  spa: 'gen-browser',
  mobile: 'gen-mobileapp',
  ios: 'gen-mobileapp',
  android: 'gen-mobileapp',
  desktop: 'gen-desktopapp',
  iot: 'gen-iot',
  cli: 'gen-cli',
  // External
  thirdparty: 'gen-thirdpartyapi',
  saas: 'gen-saas',
  payment: 'gen-paymentgateway',
  stripe: 'gen-paymentgateway',
  paypal: 'gen-paymentgateway',
  email: 'gen-emailservice',
  sendgrid: 'gen-emailservice',
  ses: 'gen-emailservice',
  auth: 'gen-auth',
  oauth: 'gen-auth',
  oidc: 'gen-auth',
  // Layers
  vpc: 'gen-vpc',
  subnet: 'gen-subnet-private',
  publicsubnet: 'gen-subnet-public',
  privatesubnet: 'gen-subnet-private',
  region: 'gen-region',
  az: 'gen-az',
  cluster: 'gen-cluster',
  sg: 'gen-securitygroup',
  securitygroup: 'gen-securitygroup',
  // Security
  iam: 'gen-iam',
  kms: 'gen-kms',
  keyvault: 'gen-kms',
  secrets: 'gen-secrets',
  secret: 'gen-secrets',
  secretsmanager: 'gen-secrets',
  waf: 'gen-waf',
  ddos: 'gen-ddos',
  shield: 'gen-ddos',
  bastion: 'gen-bastion',
  jumpbox: 'gen-bastion',
  cert: 'gen-cert',
  certmanager: 'gen-cert',
  tls: 'gen-cert',
  ssl: 'gen-cert',
  siem: 'gen-siem',
  idp: 'gen-idp',
  okta: 'gen-idp',
  auth0: 'gen-idp',
  mfa: 'gen-mfa',
  '2fa': 'gen-mfa',
  vault: 'gen-vault',
  hashicorpvault: 'gen-vault',
  // DevOps
  monitoring: 'gen-monitoring',
  grafana: 'gen-monitoring',
  prometheus: 'gen-monitoring',
  datadog: 'gen-monitoring',
  logging: 'gen-logging',
  logs: 'gen-logging',
  elk: 'gen-logging',
  splunk: 'gen-logging',
  tracing: 'gen-tracing',
  jaeger: 'gen-tracing',
  cicd: 'gen-cicd',
  pipeline: 'gen-cicd',
  jenkins: 'gen-cicd',
  github: 'gen-gitrepo',
  gitlab: 'gen-gitrepo',
  registry: 'gen-registry',
  // IaC
  terraform: 'gen-terraform',
  cloudformation: 'gen-cloudformation',
  pulumi: 'gen-pulumi',
  ansible: 'gen-ansible',
  helm: 'gen-helm',
  bicep: 'gen-bicep',
  arm: 'gen-bicep',
  cdk: 'gen-cdk',
};

export type MatchType = 'exact' | 'keyword' | 'fallback';

export interface MapResult {
  component: CloudComponent;
  matchType: MatchType;
}

function tokenize(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter(Boolean);
}

export function mapMermaidNode(node: MermaidNode): MapResult {
  const idx = getIndex();
  const labelLower = node.label.toLowerCase().trim();
  const idLower = node.id.toLowerCase().trim();

  if (idx.byId.has(idLower)) {
    return { component: idx.byId.get(idLower)!, matchType: 'exact' };
  }
  if (idx.byName.has(labelLower)) {
    return { component: idx.byName.get(labelLower)!, matchType: 'exact' };
  }

  const idTokens = tokenize(node.id);
  const labelTokens = tokenize(node.label);
  const allTokens = [...idTokens, ...labelTokens];

  // Two-token combos first (e.g., "secrets manager", "load balancer")
  for (let i = 0; i < allTokens.length - 1; i++) {
    const combo = allTokens[i] + allTokens[i + 1];
    if (KEYWORD_MAP[combo]) {
      const comp = idx.byId.get(KEYWORD_MAP[combo]);
      if (comp) return { component: comp, matchType: 'keyword' };
    }
  }
  for (const tok of allTokens) {
    if (KEYWORD_MAP[tok]) {
      const comp = idx.byId.get(KEYWORD_MAP[tok]);
      if (comp) return { component: comp, matchType: 'keyword' };
    }
  }

  // Shape-based hints
  if (node.shape === 'cylinder') {
    const comp = idx.byId.get('gen-sqldb');
    if (comp) return { component: comp, matchType: 'keyword' };
  }
  if (node.shape === 'circle') {
    const comp = idx.byId.get('gen-browser');
    if (comp) return { component: comp, matchType: 'keyword' };
  }
  if (node.shape === 'hexagon') {
    const comp = idx.byId.get('gen-messagequeue');
    if (comp) return { component: comp, matchType: 'keyword' };
  }

  const fallback = idx.byId.get('gen-server');
  if (fallback) return { component: fallback, matchType: 'fallback' };
  // Index always contains gen-server, but be safe:
  const any = idx.byId.values().next().value as CloudComponent;
  return { component: any, matchType: 'fallback' };
}
