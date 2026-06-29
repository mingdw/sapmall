import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  ArrowRight,
  Coins,
  Info,
  Landmark,
  ShoppingBag,
  Ticket,
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { CAMPAIGNS } from '../mocks/campaigns.mock';
import { getClaimedCampaignSlugs } from '../utils/mockParticipation';
import styles from './RewardsSidebar.module.scss';

const RewardsSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isConnected } = useAccount();

  const claimedSlugs = useMemo(() => getClaimedCampaignSlugs(), []);
  const claimedTitles = useMemo(
    () =>
      claimedSlugs
        .map((slug) => {
          const campaign = CAMPAIGNS.find((c) => c.slug === slug);
          if (!campaign) return null;
          return t(`rewards.campaigns.${slug}.title`);
        })
        .filter(Boolean) as string[],
    [claimedSlugs, t],
  );

  return (
    <aside className={styles.sidebar} aria-label={t('rewards.sidebarAria')}>
      <section className={styles.panel} aria-labelledby="rewards-wallet-notice">
        <div className={styles.panelIcon} aria-hidden>
          <Info size={18} strokeWidth={2.25} />
        </div>
        <h2 id="rewards-wallet-notice" className={styles.panelTitle}>
          {t('rewards.walletNoticeTitle')}
        </h2>
        <p className={styles.panelHint}>{t('rewards.walletNoticeBody')}</p>
        {!isConnected ? (
          <div className={styles.connectWrap}>
            <ConnectButton />
          </div>
        ) : null}
      </section>

      <section className={styles.panel} aria-labelledby="rewards-my-activity">
        <div className={styles.panelIcon} data-tone="amber" aria-hidden>
          <Ticket size={18} strokeWidth={2.25} />
        </div>
        <h2 id="rewards-my-activity" className={styles.panelTitle}>
          {t('rewards.myActivityTitle')}
        </h2>
        {claimedTitles.length > 0 ? (
          <ul className={styles.claimedList}>
            {claimedTitles.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.panelHint}>{t('rewards.myActivityEmpty')}</p>
        )}
      </section>

      <section className={styles.panel} aria-labelledby="rewards-quick-links">
        <h2 id="rewards-quick-links" className={styles.panelTitle}>
          {t('rewards.quickLinksTitle')}
        </h2>
        <nav className={styles.quickLinks}>
          <Link to="/marketplace" className={styles.quickLink}>
            <ShoppingBag size={16} strokeWidth={2} aria-hidden />
            <span>{t('navigation.marketplace')}</span>
            <ArrowRight size={14} className={styles.quickLinkArrow} aria-hidden />
          </Link>
          <Link to="/dao" className={styles.quickLink}>
            <Landmark size={16} strokeWidth={2} aria-hidden />
            <span>{t('navigation.dao')}</span>
            <ArrowRight size={14} className={styles.quickLinkArrow} aria-hidden />
          </Link>
          <Link to="/exchange" className={styles.quickLink}>
            <Coins size={16} strokeWidth={2} aria-hidden />
            <span>{t('navigation.exchange')}</span>
            <ArrowRight size={14} className={styles.quickLinkArrow} aria-hidden />
          </Link>
        </nav>
      </section>
    </aside>
  );
};

export default RewardsSidebar;
