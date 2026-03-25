export default function ProgressBar({ current, total, label, showCount = true }) {
  const percentage = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full" data-testid="progress-bar">
      {(label || showCount) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-xs text-[#8E8E93] tracking-widest uppercase">
              {label}
            </span>
          )}
          {showCount && (
            <span className="text-xs text-[#8E8E93]">
              {current}/{total}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-[#3A3A3C] h-px">
        <div
          className="bg-white h-px transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
