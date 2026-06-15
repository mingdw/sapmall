import React from 'react';
import { useTranslation } from 'react-i18next';
import { Gift, Sparkles, Wallet } from 'lucide-react';
import type { CampaignCategoryFilter, CampaignStatus } from '../types';
import styles from './RewardsHeroSection.module.scss';

type QuickFilterPayload = {
  tab: CampaignStatus;
  category?: CampaignCategoryFilter;
};

type Props = {
  onQuickFilter?: (payload: QuickFilterPayload) => void;
};

const RewardsHeroSection: React.FC<Props> = ({ onQuickFilter }) => {
  const { t } = useTranslation();

  const quickFilters: { key: string; label: string; payload: QuickFilterPayload }[] = [
    { key: 'ongoing', label: t('rewards.heroQuickOngoing'), payload: { tab: 'ongoing' } },
    { key: 'newbie', label: t('rewards.heroQuickNewbie'), payload: { tab: 'ongoing', category: 'newbie' } },
    { key: 'bags', label: t('rewards.heroQuickBags'), payload: { tab: 'ongoing', category: 'bags' } },
  ];

  return (
    <header className={styles.hero} aria-label={t('rewards.title')}>
      <div className={styles.heroGlow} aria-hidden />
      <div className={styles.heroGlowSecondary} aria-hidden />
      <div className={styles.heroMesh} aria-hidden />

      <div className={styles.heroLayout}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>
            <Sparkles size={14} strokeWidth={2.25} aria-hidden />
            {t('rewards.badgeHub')}
          </span>
          <h1 className={styles.heroTitle}>{t('rewards.title')}</h1>
          <p className={styles.heroSubtitle}>{t('rewards.heroSubtitle')}</p>
          <p className={styles.heroHint}>
            <Wallet size={13} strokeWidth={2.25} aria-hidden />
            {t('rewards.heroHint')}
          </p>

          {onQuickFilter ? (
            <div className={styles.heroQuickFilters} role="group" aria-label={t('rewards.categoryFilterLabel')}>
              {quickFilters.map(({ key, label, payload }) => (
                <button
                  key={key}
                  type="button"
                  className={styles.heroQuickBtn}
                  data-filter={key}
                  onClick={() => onQuickFilter(payload)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.heroVisual} aria-hidden>
          <div className={styles.heroOrb}>
            <Gift size={28} strokeWidth={1.75} />
          </div>
          <span className={styles.heroOrbRing} />
          <span className={styles.heroOrbRing} data-delay />
        </div>
      </div>
    </header>
  );
};

export default RewardsHeroSection;
