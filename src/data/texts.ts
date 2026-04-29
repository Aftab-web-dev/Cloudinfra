export interface TextPreset {
  id: string;
  name: string;
  description: string;
  text: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  italic?: boolean;
  background?: string;
}

export const textPresets: TextPreset[] = [
  { id: 'text-title', name: 'Title', description: 'Large heading', text: 'Architecture Title', fontSize: 28, fontWeight: 700, color: '#111827' },
  { id: 'text-subtitle', name: 'Subtitle', description: 'Section subtitle', text: 'Subtitle goes here', fontSize: 18, fontWeight: 600, color: '#374151' },
  { id: 'text-section', name: 'Section Header', description: 'Uppercase divider', text: 'SECTION', fontSize: 14, fontWeight: 700, color: '#6366f1' },
  { id: 'text-paragraph', name: 'Paragraph', description: 'Body text block', text: 'Add a description for this part of the diagram.', fontSize: 12, fontWeight: 400, color: '#374151' },
  { id: 'text-note', name: 'Note', description: 'Informational note', text: 'Note: ...', fontSize: 12, fontWeight: 500, color: '#6b7280', italic: true },
  { id: 'text-todo', name: 'TODO', description: 'Open action item', text: 'TODO: ...', fontSize: 12, fontWeight: 700, color: '#f59e0b', background: '#fef3c7' },
  { id: 'text-warning', name: 'Warning', description: 'Caution / risk', text: 'Warning: ...', fontSize: 12, fontWeight: 700, color: '#b91c1c', background: '#fee2e2' },
  { id: 'text-important', name: 'Important', description: 'Highlighted callout', text: 'Important: ...', fontSize: 12, fontWeight: 700, color: '#7c3aed', background: '#ede9fe' },
  { id: 'text-success', name: 'Success', description: 'Positive callout', text: 'OK: works as expected', fontSize: 12, fontWeight: 600, color: '#047857', background: '#d1fae5' },
  { id: 'text-label', name: 'Label', description: 'Small caption', text: 'label', fontSize: 10, fontWeight: 600, color: '#6b7280' },
];

export const textSizePresets: { name: string; size: number; weight: number }[] = [
  { name: 'XS', size: 10, weight: 400 },
  { name: 'SM', size: 12, weight: 400 },
  { name: 'MD', size: 14, weight: 500 },
  { name: 'LG', size: 18, weight: 600 },
  { name: 'XL', size: 24, weight: 700 },
  { name: '2XL', size: 32, weight: 700 },
];

export const textColorPresets: { name: string; value: string }[] = [
  { name: 'Default', value: '#111827' },
  { name: 'Muted', value: '#6b7280' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
];
