import React from 'react';

interface GradientSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  unit?: string;
}

const GradientSlider: React.FC<GradientSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  description,
  unit = ''
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Format value display based on step size
  const displayValue = step < 1 && step > 0 
    ? value.toFixed(2) 
    : value.toString();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-900">
          {label}
        </label>
        <span className="bg-white text-gray-900 font-semibold text-sm px-3 py-1 rounded-md border border-gray-300">
          {displayValue}{unit}
        </span>
      </div>
      
      <div className="relative">
        {/* Slider Track */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Active Fill */}
          <div
            className="absolute left-0 top-0 h-full bg-[#4F46E5] rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
          
          {/* Slider Input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer z-10"
          />
          
          {/* Thumb (visual indicator) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-[#4F46E5] 
                       rounded-full shadow-lg border-2 border-white
                       transition-all duration-200 hover:scale-110"
            style={{ left: `calc(${percentage}% - 10px)` }}
          />
        </div>
      </div>
      
      {description && (
        <p className="text-xs text-gray-600 mt-2">{description}</p>
      )}
    </div>
  );
};

export default GradientSlider;

