export const categories = ['Clickables', 'Inputs', 'Layout', 'Data', 'Media'] as const;
export type Category = (typeof categories)[number];
export type ComponentId =
  'button' | 'link' | 'input' | 'textarea' | 'checkbox' | 'select' | 'card' | 'table' | 'image';

export interface ComponentDefinition {
  id: ComponentId;
  name: string;
  category: Category;
  label: string;
  width: number;
  height: number;
  supportsDisabled: boolean;
}

export const catalog: ComponentDefinition[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'Clickables',
    label: 'Button',
    width: 140,
    height: 44,
    supportsDisabled: true,
  },
  {
    id: 'link',
    name: 'Link',
    category: 'Clickables',
    label: 'Visit example',
    width: 180,
    height: 44,
    supportsDisabled: false,
  },
  {
    id: 'input',
    name: 'Text input',
    category: 'Inputs',
    label: 'Your name',
    width: 240,
    height: 44,
    supportsDisabled: true,
  },
  {
    id: 'textarea',
    name: 'Text area',
    category: 'Inputs',
    label: 'Notes',
    width: 280,
    height: 120,
    supportsDisabled: true,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'Inputs',
    label: 'Accept terms',
    width: 220,
    height: 44,
    supportsDisabled: true,
  },
  {
    id: 'select',
    name: 'Select',
    category: 'Inputs',
    label: 'Choose an option',
    width: 240,
    height: 44,
    supportsDisabled: true,
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Layout',
    label: 'Card title',
    width: 280,
    height: 160,
    supportsDisabled: false,
  },
  {
    id: 'table',
    name: 'Table',
    category: 'Data',
    label: 'Sample inventory',
    width: 320,
    height: 180,
    supportsDisabled: false,
  },
  {
    id: 'image',
    name: 'Image',
    category: 'Media',
    label: 'Image placeholder',
    width: 280,
    height: 180,
    supportsDisabled: false,
  },
];

export interface Draft {
  label: string;
  width: number;
  height: number;
  disabled: boolean;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
}

export function defaultDraft(component: ComponentDefinition): Draft {
  return {
    label: component.label,
    width: component.width,
    height: component.height,
    disabled: false,
    textColor: '#000000',
    backgroundColor: '#ffffff',
    borderColor: '#000000',
  };
}

export function filterCatalog(query: string): ComponentDefinition[] {
  const normalized = query.trim().toLowerCase();
  return catalog.filter((component) =>
    `${component.name} ${component.category}`.toLowerCase().includes(normalized),
  );
}

export function validDimension(value: string): number | null {
  if (!value.trim()) return null;
  const dimension = Number(value);
  return Number.isInteger(dimension) && dimension >= 24 && dimension <= 1000 ? dimension : null;
}
