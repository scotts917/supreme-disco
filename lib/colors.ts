export interface ColorOption {
  id: string;
  label: string;
  hexColor: string;
}

export const PRIMARY_COLORS: ColorOption[] = [
  {
    id: 'red',
    label: 'Red',
    hexColor: '#ef4444',
  },
  {
    id: 'blue',
    label: 'Blue',
    hexColor: '#3b82f6',
  },
  {
    id: 'green',
    label: 'Green',
    hexColor: '#22c55e',
  },
  {
    id: 'yellow',
    label: 'Yellow',
    hexColor: '#facc15',
  },
  {
    id: 'purple',
    label: 'Purple',
    hexColor: '#a855f7',
  },
];

export const getColorById = (id: string): ColorOption | undefined => {
  return PRIMARY_COLORS.find(color => color.id === id);
};

export const DEFAULT_COLOR = 'blue';
