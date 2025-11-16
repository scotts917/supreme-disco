'use client';

import { PRIMARY_COLORS } from '@/lib/colors';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (colorId: string) => void;
}

export default function ColorPicker({
  selectedColor,
  onColorChange,
}: ColorPickerProps) {
  return (
    <div className="flex gap-2 items-center">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Color:
      </label>
      <div className="flex gap-2">
        {PRIMARY_COLORS.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorChange(color.id)}
            className={`w-8 h-8 rounded transition-transform ${color.bgClass} ${
              selectedColor === color.id
                ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                : 'hover:scale-105'
            }`}
            title={color.label}
            aria-label={`Set color to ${color.label}`}
          />
        ))}
      </div>
    </div>
  );
}
