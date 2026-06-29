import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { getCampaignBySlug } from './mocks/campaigns.mock';
import { rewardsHomePath } from './utils/campaignNavigation';
import { isCampaignClaimed, markCampaignClaimed } from './utils/mockParticipation';
import type { CampaignCta } from './types';
import styles from './RewardsPageDetail.module.scss';

const formatDate = (iso: string): string => iso.slice(0, 10);

const resolveCtaLabel = (t: (key: string) => string, cta: CampaignCta): string =>
  t(`rewards.cta.${cta.labelKey}`);

const RewardsCampaignPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const campaign = getCampaignBySlug(slug);
  const [claimed, setClaimed] = useState(() => (slug ? isCampaignClaimed(slug) : false));
  const [claimMessage, setClaimMessage] = useState('');

  if (!campaign) {
    return (
      <section className={styles.detailShell}>
        <div className={`${styles.detailCard} ${styles.notFound}`}>
          <p>{t('rewards.campaignDetail.notFound')}</p>
          <Link to={rewardsHomePath} className={styles.detailBreadcrumb}>
            <ArrowLeft size={16} strokeWidth={2.25} aria-hidden />
            {t('rewards.campaignDetail.back')}
          </Link>
        </div>
      </section>
    );
  }

  const title = t(`rewards.campaigns.${campaign.slug}.title`);
  const desc = t(`rewards.campaigns.${campaign.slug}.desc`);
  const rules = t(`rewards.campaigns.${campaign.slug}.rules`, { returnObjects: true }) as string[];
  const steps = t(`rewards.campaigns.${campaign.slug}.steps`, { returnObjects: true }) as string[];
  const rulesList = Array.isArray(rules) ? rules : [];
  const stepsList = Array.isArray(steps) ? steps : [];
  const ctaLabel = resolveCtaLabel(t, campaign.cta);

  const handleCta = () => {
    if (campaign.status === 'ended') return;

    if (campaign.cta.type === 'mock_claim') {
      if (claimed) return;
      markCampaignClaimed(campaign.slug);
      setClaimed(true);
      setClaimMessage(t('rewards.campaignDetail.claimSuccess'));
      return;
    }

    if (campaign.cta.href) {
      navigate(campaign.cta.href);
    }
  };

  const periodLabel = campaign.isLongTerm
    ? t('rewards.longTerm')
    : campaign.endAt
      ? `${formatDate(campaign.startAt)} \u2014 ${formatDate(campaign.endAt)}`
      : formatDate(campaign.startAt);

  const ctaDisabled = campaign.status === 'ended' || (campaign.cta.type === 'mock_claim' && claimed);

  return (
    <article className={styles.detailShell}>
      <Link to={rewardsHomePath} className={styles.detailBreadcrumb}>
        <ArrowLeft size={16} strokeWidth={2.25} aria-hidden />
        {t('rewards.campaignDetail.back')}
      </Link>

      <div className={styles.detailCard}>
        <div className={styles.detailCover}>
          <img src={campaign.coverUrl} alt="" />
        </div>
        <div className={styles.detailBody}>
          <div className={styles.detailBadges}>
            <span className={styles.categoryBadge}>{t(`rewards.categories.${campaign.category}`)}</span>
            <span className={styles.statusBadge} data-status={campaign.status}>
              {t(`rewards.status.${campaign.status}`)}
            </span>
            {campaign.hot ? <span className={styles.campaignHot}>{t('rewards.hot')}</span> : null}
          </div>

          <h1 className={styles.detailTitle}>{title}</h1>
          <p className={styles.detailDesc}>{desc}</p>

          <div className={styles.detailMetaGrid}>
            <div className={styles.detailMetaItem}>
              <span className={styles.detailMetaLabel}>{t('rewards.campaignDetail.period')}</span>
              <span className={styles.detailMetaValue}>{periodLabel}</span>
            </div>
            {campaign.participants != null ? (
              <div className={styles.detailMetaItem}>
                <span className={styles.detailMetaLabel}>{t('rewards.campaignDetail.participants')}</span>
                <span className={styles.detailMetaValue}>
                  {t('rewards.participants', { count: campaign.participants })}
                </span>
              </div>
            ) : null}
          </div>

          <section className={styles.detailSection}>
            <h2 className={styles.detailSectionTitle}>{t('rewards.campaignDetail.rewards')}</h2>
            <div className={styles.rewardTypeList}>
              {campaign.rewardTypes.map((type) => (
                <span key={type} className={styles.rewardTypeBadge}>
                  {t(`rewards.rewardTypes.${type}`)}
                </span>
              ))}
            </div>
          </section>

          {rulesList.length > 0 ? (
            <section className={styles.detailSection}>
              <h2 className={styles.detailSectionTitle}>{t('rewards.campaignDetail.rules')}</h2>
              <ul className={styles.detailRules}>
                {rulesList.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {stepsList.length > 0 ? (
            <section className={styles.detailSection}>
              <h2 className={styles.detailSectionTitle}>{t('rewards.campaignDetail.steps')}</h2>
              <ol className={styles.detailSteps}>
                {stepsList.map((step, index) => (
                  <li key={step} className={styles.detailStep}>
                    <span className={styles.detailStepNum}>{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <div className={styles.walletHintBox}>{t(`rewards.walletHints.${campaign.walletHint}`)}</div>

          <div className={styles.detailActions}>
            <button
              type="button"
              className={styles.ctaPrimary}
              disabled={ctaDisabled}
              onClick={handleCta}
            >
              {campaign.cta.type === 'mock_claim' && claimed
                ? t('rewards.campaignDetail.alreadyClaimed')
                : ctaLabel}
            </button>
          </div>
          {claimMessage ? <p className={styles.claimToast}>{claimMessage}</p> : null}
        </div>
      </div>
    </article>
  );
};

export default RewardsCampaignPage;
