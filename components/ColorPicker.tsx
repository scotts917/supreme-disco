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
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              transition: selectedColor === color.id ? 'transform 0.2s' : 'transform 0.2s',
              transform: selectedColor === color.id ? 'scale(1.1)' : 'scale(1)',
              boxShadow: selectedColor === color.id ? '0 0 0 2px rgba(0,0,0,0.1), 0 0 0 4px rgba(120,120,120,0.5)' : 'none',
            }}
            title={color.label}
            aria-label={`Set color to ${color.label}`}
            onMouseEnter={(e) => {
              if (selectedColor !== color.id) {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = selectedColor === color.id ? 'scale(1.1)' : 'scale(1)';
            }}
          />
        ))}
      </div>
    </div>
  );
}
