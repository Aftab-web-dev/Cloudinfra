import type { CanvasNode } from '../types';

interface CloudNodeData {
  component?: { type: string; category: string };
}

// Known protocol mappings between service types
const protocolMap: [RegExp, RegExp, string][] = [
  // API Gateway → anything
  [/apigateway|apim|api-gateway/, /lambda|functions|function/, 'HTTPS'],
  [/apigateway|apim|api-gateway/, /container|ecs|aks|gke|cloudrun/, 'HTTPS'],
  [/apigateway|apim|api-gateway/, /server/, 'HTTPS'],

  // Load balancer → compute
  [/elb|loadbalancer|slb|loadbalancing/, /ec2|vm|server|container|ecs/, 'HTTP/HTTPS'],

  // Compute → database
  [/ec2|vm|server|lambda|functions|container|ecs|aks|gke|cloudrun|fargate/, /rds|sqldb|cloudsql|aurora|postgresql|mysql|sql/, 'TCP/SQL'],
  [/ec2|vm|server|lambda|functions|container|ecs|aks|gke|cloudrun|fargate/, /dynamodb|cosmosdb|firestore|documentdb|nosql/, 'SDK/API'],
  [/ec2|vm|server|lambda|functions|container|ecs|aks|gke|cloudrun|fargate/, /elasticache|redis|memorystore|tair|cache/, 'TCP/Redis'],

  // Compute → storage
  [/ec2|vm|server|lambda|functions|container/, /s3|blobstorage|cloudstorage|oss|objectstorage/, 'SDK/API'],

  // Compute → messaging
  [/ec2|vm|server|lambda|functions|container/, /sqs|servicebus|pubsub|mns|messagequeue/, 'SDK/API'],
  [/ec2|vm|server|lambda|functions|container/, /sns|eventbridge|eventgrid|eventhubs|eventbus/, 'Event'],
  [/ec2|vm|server|lambda|functions|container/, /kinesis|stream|dataflow/, 'Stream'],

  // CDN → compute/storage
  [/cloudfront|cdn|frontdoor/, /s3|blobstorage|cloudstorage|objectstorage/, 'HTTP'],
  [/cloudfront|cdn|frontdoor/, /elb|loadbalancer|server|container/, 'HTTP'],

  // DNS → CDN/LB
  [/route53|dns/, /cloudfront|cdn|frontdoor|elb|loadbalancer/, 'DNS'],

  // Client → anything
  [/browser|mobileapp|desktopapp|client/, /cloudfront|cdn|frontdoor/, 'HTTPS'],
  [/browser|mobileapp|desktopapp|client/, /dns|route53/, 'DNS'],
  [/browser|mobileapp|desktopapp|client/, /apigateway|apim/, 'HTTPS'],
  [/browser|mobileapp|desktopapp|client/, /elb|loadbalancer/, 'HTTPS'],

  // Messaging → compute (event-driven)
  [/sqs|servicebus|pubsub|eventbridge|eventgrid|messagequeue|eventbus/, /lambda|functions|container|serverless/, 'Event Trigger'],

  // Compute → monitoring
  [/ec2|vm|server|lambda|functions|container/, /cloudwatch|monitor|cloudmonitoring/, 'Metrics'],
  [/ec2|vm|server|lambda|functions|container/, /xray|appinsights|cloudtrace|tracing/, 'Traces'],

  // Auth
  [/apigateway|apim|server|container/, /cognito|ad|iam|auth/, 'OAuth/JWT'],

  // CI/CD
  [/cicd|codepipeline|cloudbuild|gitrepo/, /ecr|registry|artifactregistry/, 'Push'],
  [/ecr|registry|artifactregistry/, /ecs|eks|aks|gke|kubernetes|container/, 'Pull'],
];

export function getSmartLabel(
  sourceNode: CanvasNode,
  targetNode: CanvasNode
): string | undefined {
  const sourceData = sourceNode.data as unknown as CloudNodeData;
  const targetData = targetNode.data as unknown as CloudNodeData;

  const sourceType = sourceData.component?.type || '';
  const targetType = targetData.component?.type || '';

  for (const [srcPattern, tgtPattern, label] of protocolMap) {
    if (srcPattern.test(sourceType) && tgtPattern.test(targetType)) {
      return label;
    }
  }

  return undefined;
}
