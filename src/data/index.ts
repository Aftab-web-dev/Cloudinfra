import { awsLibrary } from './aws';
import { azureLibrary } from './azure';
import { gcpLibrary } from './gcp';
import { alibabaLibrary } from './alibaba';
import { genericLibrary } from './generic';
import type { ProviderLibrary, CloudProvider } from '../types';

export const providerLibraries: Record<CloudProvider, ProviderLibrary> = {
  aws: awsLibrary,
  azure: azureLibrary,
  gcp: gcpLibrary,
  alibaba: alibabaLibrary,
  generic: genericLibrary,
};

export const providerList: { key: CloudProvider; label: string; color: string }[] = [
  { key: 'aws', label: 'AWS', color: '#FF9900' },
  { key: 'azure', label: 'Azure', color: '#0078D4' },
  { key: 'gcp', label: 'GCP', color: '#4285F4' },
  { key: 'alibaba', label: 'Alibaba', color: '#FF6A00' },
  { key: 'generic', label: 'Generic', color: '#6366f1' },
];
