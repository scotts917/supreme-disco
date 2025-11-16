export interface ColorOption {
  id: string;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const PRIMARY_COLORS: ColorOption[] = [
  {
    id: 'red',
    label: 'Red',
    bgClass: 'bg-red-500',
    textClass: 'text-white',
    borderClass: 'border-red-600',
  },
  {
    id: 'blue',
    label: 'Blue',
    bgClass: 'bg-blue-500',
    textClass: 'text-white',
    borderClass: 'border-blue-600',
  },
  {
    id: 'green',
    label: 'Green',
    bgClass: 'bg-green-500',
    textClass: 'text-white',
    borderClass: 'border-green-600',
  },
  {
    id: 'yellow',
    label: 'Yellow',
    bgClass: 'bg-yellow-400',
    textClass: 'text-gray-900',
    borderClass: 'border-yellow-500',
  },
  {
    id: 'purple',
    label: 'Purple',
    bgClass: 'bg-purple-500',
    textClass: 'text-white',
    borderClass: 'border-purple-600',
  },
];

export const getColorById = (id: string): ColorOption | undefined => {
  return PRIMARY_COLORS.find(color => color.id === id);
};

export const DEFAULT_COLOR = 'blue';
