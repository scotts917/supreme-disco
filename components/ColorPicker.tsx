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
  const colorMap: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#facc15',
    purple: '#a855f7',
  };

  return (
    <div className="flex gap-2 items-center">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Color:
      </label>
      <div className="flex gap-2">
        {PRIMARY_COLORS.map((color) => (
          <div
            key={color.id}
            onClick={() => onColorChange(color.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onColorChange(color.id);
              }
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: colorMap[color.id],
              border: selectedColor === color.id ? '3px solid white' : '1px solid rgba(255,255,255,0.2)',
              transform: selectedColor === color.id ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.2s ease',
              boxShadow: selectedColor === color.id ? '0 0 8px rgba(0,0,0,0.4)' : 'none',
            }}
            title={color.label}
            aria-label={`Set color to ${color.label}`}
          />
        ))}
      </div>
    </div>
  );
}
