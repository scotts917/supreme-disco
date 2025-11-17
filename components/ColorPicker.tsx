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
            style={{
              backgroundColor: color.hexColor,
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transform: selectedColor === color.id ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s ease',
            }}
            title={color.label}
            aria-label={`Set color to ${color.label}`}
          />
        ))}
      </div>
    </div>
  );
}
