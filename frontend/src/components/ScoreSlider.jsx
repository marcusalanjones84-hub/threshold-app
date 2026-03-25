export default function ScoreSlider({
  label,
  value,
  onChange,
  lowLabel = 'Low',
  highLabel = 'High',
  description
}) {
  return (
    <div className="mb-8" data-testid={`score-slider-${label?.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="text-sm font-medium text-white block">
            {label}
          </label>
          {description && (
            <p className="text-xs text-[#8E8E93] mt-1">
              {description}
            </p>
          )}
        </div>
        <span className="text-3xl font-bold text-white tabular-nums ml-4">
          {value}
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full cursor-pointer"
        data-testid={`slider-${label?.toLowerCase().replace(/\s/g, '-')}`}
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-[#8E8E93]">
          {lowLabel}
        </span>
        <span className="text-xs text-[#8E8E93]">
          {highLabel}
        </span>
      </div>
    </div>
  );
}
