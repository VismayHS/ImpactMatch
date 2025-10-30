import { motion } from 'framer-motion';
import { BADGE_COLORS, BADGE_THRESHOLDS } from '../constants';

export default function BadgeDisplay({ badges = [], impactScore }) {
  const allBadges = [
    {
      name: 'BRONZE',
      threshold: BADGE_THRESHOLDS.BRONZE,
      color: BADGE_COLORS.BRONZE,
      emoji: '🥉',
    },
    {
      name: 'SILVER',
      threshold: BADGE_THRESHOLDS.SILVER,
      color: BADGE_COLORS.SILVER,
      emoji: '🥈',
    },
    {
      name: 'GOLD',
      threshold: BADGE_THRESHOLDS.GOLD,
      color: BADGE_COLORS.GOLD,
      emoji: '🥇',
    },
  ];

  const earnedBadges = allBadges.filter(
    (badge) => impactScore >= badge.threshold
  );

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Badges</h3>
      <div className="grid grid-cols-3 gap-4">
        {allBadges.map((badge, index) => {
          const isEarned = earnedBadges.some((b) => b.name === badge.name);
          return (
            <motion.div
              key={badge.name}
              initial={isEarned ? { scale: 0.6 } : false}
              animate={isEarned ? { scale: [0.6, 1.05, 1] } : {}}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                isEarned
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-gray-50 opacity-50'
              }`}
            >
              <span className="text-4xl mb-2">{badge.emoji}</span>
              <span
                className={`text-xs font-semibold ${
                  isEarned ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {badge.name}
              </span>
              <span className="text-xs text-secondary mt-1">
                {badge.threshold} pts
              </span>
            </motion.div>
          );
        })}
      </div>
      {earnedBadges.length > 0 && (
        <p className="text-sm text-center text-secondary mt-4">
          🎉 You've earned {earnedBadges.length} badge{earnedBadges.length > 1 ? 's' : ''}!
        </p>
      )}
    </div>
  );
}
