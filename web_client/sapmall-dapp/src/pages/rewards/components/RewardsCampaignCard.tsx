import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Clock, Users } from 'lucide-react';
import type { Campaign } from '../types';
import { rewardsCampaignPath } from '../utils/campaignNavigation';
import { getCampaignDaysLeft } from '../utils/rewardsCampaignTime';
import styles from './RewardsCampaignCard.module.scss';

type Props = {
  campaign: Campaign;
  variant?: 'minimal' | 'default';
};

const RewardsCampaignCard: React.FC<Props> = ({ campaign, variant = 'minimal' }) => {
  const { t } = useTranslation();
  const title = t(`rewards.campaigns.${campaign.slug}.title`);
  const desc = t(`rewards.campaigns.${campaign.slug}.desc`);
  const daysLeft = getCampaignDaysLeft(campaign);

  const timeLabel = campaign.isLongTerm
    ? t('rewards.longTerm')
    : daysLeft !== null
      ? t('rewards.daysLeft', { count: daysLeft })
      : campaign.endAt
        ? campaign.endAt.slice(0, 10)
        : '\u2014';

  if (variant === 'minimal') {
    const primaryReward = campaign.rewardTypes[0];

    return (
      <Link
        to={rewardsCampaignPath(campaign.slug)}
        className={styles.cardMinimal}
        data-category={campaign.category}
        data-status={campaign.status}
      >
        {campaign.hot ? <span className={styles.hotBadge}>{t('rewards.hot')}</span> : null}
        <div className={styles.coverMinimal}>
          <img src={campaign.coverUrl} alt="" loading="lazy" />
          <span className={styles.statusBadge} data-status={campaign.status}>
            {t(`rewards.status.${campaign.status}`)}
          </span>
        </div>
        <div className={styles.bodyMinimal}>
          <span className={styles.categoryMinimal}>{t(`rewards.categories.${campaign.category}`)}</span>
          <h3 className={styles.titleMinimal}>{title}</h3>
          <p className={styles.descMinimal}>{desc}</p>
          <div className={styles.metaMinimal}>
            {primaryReward ? (
              <span className={styles.rewardPillMinimal}>{t(`rewards.rewardTypes.${primaryReward}`)}</span>
            ) : null}
            <span className={styles.metaItemMinimal}>
              {campaign.participants != null ? (
                <>
                  <Users size={11} strokeWidth={2.25} aria-hidden />
                  {t('rewards.participants', { count: campaign.participants })}
                </>
              ) : (
                <>
                  <Clock size={11} strokeWidth={2.25} aria-hidden />
                  {timeLabel}
                </>
              )}
            </span>
            <ArrowUpRight size={13} strokeWidth={2.25} className={styles.arrowMinimal} aria-hidden />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={rewardsCampaignPath(campaign.slug)}
      className={styles.card}
      data-category={campaign.category}
    >
      {campaign.hot ? <span className={styles.hotBadge}>{t('rewards.hot')}</span> : null}
      <div className={styles.cover}>
        <img src={campaign.coverUrl} alt="" loading="lazy" />
        <div className={styles.coverOverlay} aria-hidden />
        <div className={styles.coverBadges}>
          <span className={styles.categoryBadge}>{t(`rewards.categories.${campaign.category}`)}</span>
          <span className={styles.statusBadge} data-status={campaign.status}>
            {t(`rewards.status.${campaign.status}`)}
          </span>
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{desc}</p>
        <div className={styles.meta}>
          {campaign.participants != null ? (
            <span className={styles.metaItem}>
              <Users size={13} strokeWidth={2.25} aria-hidden />
              {t('rewards.participants', { count: campaign.participants })}
            </span>
          ) : (
            <span />
          )}
          <span className={styles.metaItem}>
            <Clock size={13} strokeWidth={2.25} aria-hidden />
            {timeLabel}
          </span>
        </div>
        <span className={styles.linkHint}>
          {t('rewards.campaignDetail.viewDetail')}
          <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden />
        </span>
      </div>
    </Link>
  );
};

export default RewardsCampaignCard;
