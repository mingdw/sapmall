import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import styles from './RewardsHeroSection.module.scss';

const RewardsHeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className={styles.hero} aria-label={t('rewards.title')}>
      <div className={styles.heroGlow} aria-hidden />
      <div className={styles.heroMesh} aria-hidden />
      <div className={styles.heroContent}>
        <span className={styles.heroBadge}>
          <Sparkles size={14} strokeWidth={2.25} aria-hidden />
          {t('rewards.badgeHub')}
        </span>
        <h1 className={styles.heroTitle}>{t('rewards.title')}</h1>
        <p className={styles.heroSubtitle}>{t('rewards.heroSubtitle')}</p>
        <p className={styles.heroHint}>{t('rewards.heroHint')}</p>
      </div>
    </header>
  );
};

export default RewardsHeroSection;
