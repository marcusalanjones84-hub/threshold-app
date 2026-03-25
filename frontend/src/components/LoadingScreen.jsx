export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white mb-4 font-bold">Threshold</p>
        <div className="flex gap-1 justify-center">
          <div className="w-1 h-1 bg-[#8E8E93] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-[#8E8E93] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-1 bg-[#8E8E93] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
