import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarClock, Flame, TrendingUp, Users } from 'lucide-react';
import type { RewardsHubStats } from '../utils/rewardsHubStats';
import styles from './RewardsStatsStrip.module.scss';

type Props = {
  stats: RewardsHubStats;
};

const RewardsStatsStrip: React.FC<Props> = ({ stats }) => {
  const { t, i18n } = useTranslation();
  const participantsLabel = stats.totalParticipants.toLocaleString(i18n.language);

  const items = [
    {
      key: 'ongoing',
      icon: Flame,
      value: String(stats.ongoingCount),
      label: t('rewards.stats.ongoing'),
      accent: 'amber',
    },
    {
      key: 'upcoming',
      icon: CalendarClock,
      value: String(stats.upcomingCount),
      label: t('rewards.stats.upcoming'),
      accent: 'sky',
    },
    {
      key: 'participants',
      icon: Users,
      value: participantsLabel,
      label: t('rewards.stats.participants'),
      accent: 'violet',
    },
    {
      key: 'ending',
      icon: TrendingUp,
      value: String(stats.endingSoonCount),
      label: t('rewards.stats.endingSoon'),
      accent: 'rose',
    },
  ] as const;

  return (
    <div className={styles.statsStrip} role="list" aria-label={t('rewards.statsAria')}>
      {items.map(({ key, icon: Icon, value, label, accent }) => (
        <div key={key} className={styles.statCard} data-accent={accent} role="listitem">
          <span className={styles.statIcon} aria-hidden>
            <Icon strokeWidth={2} />
          </span>
          <div className={styles.statBody}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RewardsStatsStrip;
