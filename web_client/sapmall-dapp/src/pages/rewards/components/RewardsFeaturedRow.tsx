import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Clock, Flame } from 'lucide-react';
import type { Campaign } from '../types';
import { getCampaignDaysLeft } from '../utils/rewardsCampaignTime';
import { rewardsCampaignPath } from '../utils/campaignNavigation';
import styles from './RewardsFeaturedRow.module.scss';

type Props = {
  campaigns: Campaign[];
};

const RewardsFeaturedRow: React.FC<Props> = ({ campaigns }) => {
  const { t } = useTranslation();

  if (campaigns.length === 0) return null;

  return (
    <section className={styles.featured} aria-labelledby="rewards-featured-heading">
      <div className={styles.featuredHead}>
        <h2 id="rewards-featured-heading" className={styles.featuredTitle}>
          <Flame size={14} strokeWidth={2.25} aria-hidden />
          {t('rewards.featuredTitle')}
        </h2>
        <span className={styles.featuredHint}>{t('rewards.featuredHint')}</span>
      </div>
      <div className={styles.featuredTrack}>
        {campaigns.map((campaign) => {
          const title = t(`rewards.campaigns.${campaign.slug}.title`);
          const daysLeft = getCampaignDaysLeft(campaign);

          return (
            <Link
              key={campaign.slug}
              to={rewardsCampaignPath(campaign.slug)}
              className={styles.featuredCard}
              data-category={campaign.category}
            >
              <div className={styles.featuredCover}>
                <img src={campaign.coverUrl} alt="" loading="lazy" />
                <div className={styles.featuredOverlay} aria-hidden />
                {campaign.hot ? <span className={styles.featuredHot}>{t('rewards.hot')}</span> : null}
              </div>
              <div className={styles.featuredBody}>
                <span className={styles.featuredCategory}>
                  {t(`rewards.categories.${campaign.category}`)}
                </span>
                <h3 className={styles.featuredCardTitle}>{title}</h3>
                <div className={styles.featuredFooter}>
                  <span className={styles.featuredTime}>
                    <Clock size={11} strokeWidth={2.25} aria-hidden />
                    {campaign.isLongTerm
                      ? t('rewards.longTerm')
                      : daysLeft !== null
                        ? t('rewards.daysLeft', { count: daysLeft })
                        : t(`rewards.status.${campaign.status}`)}
                  </span>
                  <span className={styles.featuredLink} aria-hidden>
                    <ArrowUpRight size={12} strokeWidth={2.25} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RewardsFeaturedRow;
