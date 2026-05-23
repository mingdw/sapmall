import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Clock, Users } from 'lucide-react';
import type { Campaign } from '../types';
import { rewardsCampaignPath } from '../utils/campaignNavigation';
import styles from '../RewardsPageDetail.module.scss';

type Props = {
  campaign: Campaign;
};

const RewardsCampaignCard: React.FC<Props> = ({ campaign }) => {
  const { t } = useTranslation();
  const title = t(`rewards.campaigns.${campaign.slug}.title`);
  const desc = t(`rewards.campaigns.${campaign.slug}.desc`);

  return (
    <Link
      to={rewardsCampaignPath(campaign.slug)}
      className={styles.campaignCard}
      data-category={campaign.category}
    >
      {campaign.hot ? <span className={styles.campaignHot}>{t('rewards.hot')}</span> : null}
      <div className={styles.campaignCover}>
        <img src={campaign.coverUrl} alt="" loading="lazy" />
        <div className={styles.campaignBadges}>
          <span className={styles.categoryBadge}>{t(`rewards.categories.${campaign.category}`)}</span>
          <span className={styles.statusBadge} data-status={campaign.status}>
            {t(`rewards.status.${campaign.status}`)}
          </span>
        </div>
      </div>
      <div className={styles.campaignBody}>
        <h3 className={styles.campaignTitle}>{title}</h3>
        <p className={styles.campaignDesc}>{desc}</p>
        <div className={styles.campaignMeta}>
          {campaign.participants != null ? (
            <span className={styles.campaignMetaItem}>
              <Users size={13} strokeWidth={2.25} aria-hidden />
              {t('rewards.participants', { count: campaign.participants })}
            </span>
          ) : (
            <span />
          )}
          <span className={styles.campaignMetaItem}>
            <Clock size={13} strokeWidth={2.25} aria-hidden />
            {campaign.isLongTerm ? t('rewards.longTerm') : campaign.endAt ? campaign.endAt.slice(0, 10) : '\u2014'}
          </span>
        </div>
        <span className={styles.campaignLinkHint}>
          {t('rewards.campaignDetail.viewDetail')}
          <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden />
        </span>
      </div>
    </Link>
  );
};

export default RewardsCampaignCard;


