import { MILESTONES } from '../utils/dates';

export default function MilestoneCard({ streak }) {
  const milestone = MILESTONES[streak];
  if (!milestone) return null;

  return (
    <div className="border border-white bg-[#2C2C2E] p-6 text-center fade-in" data-testid="milestone-card">
      <p className="text-xs uppercase tracking-[0.2em] text-white mb-4 font-bold">Milestone Reached</p>
      <p className="text-2xl font-bold text-white mb-3">
        {milestone.title}
      </p>
      <p className="text-[#8E8E93] text-sm leading-relaxed max-w-xs mx-auto">
        {milestone.message}
      </p>
    </div>
  );
}
