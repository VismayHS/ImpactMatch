import { BADGE_COLORS } from '../constants';

export default function ProgressBar({ score, maxScore = 200 }) {
  const percentage = Math.min((score / maxScore) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-900">Impact Score</span>
        <span className="text-sm text-secondary">{score} / {maxScore}</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="progress-bar-fill h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
