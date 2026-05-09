import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './RewardsPageDetail.module.scss';
import type { RewardCampaign } from './rewardsCampaignMock';
import { openBagsOutbound } from './rewardsOutboundUrls';

const ACCENT_TITLE_HOVER: Record<RewardCampaign['accent'], string> = {
  indigo: 'group-hover:text-indigo-400',
  purple: 'group-hover:text-purple-400',
  blue: 'group-hover:text-blue-400',
  orange: 'group-hover:text-orange-400',
  red: 'group-hover:text-red-400',
};

const CATEGORY_BADGE: Record<RewardCampaign['category'], string> = {
  bags: 'bg-indigo-600',
  dao: 'bg-purple-600',
  task: 'bg-blue-600',
  newbie: 'bg-orange-600',
  referral: 'bg-red-600',
};

const STATUS_BADGE: Record<RewardCampaign['tab'], string> = {
  ongoing: 'bg-green-500 text-white',
  upcoming: 'bg-amber-400 text-black',
  ended: 'bg-slate-600 text-slate-100',
};

function formatCountdown(ms: number): string {
  if (ms <= 0) return '';
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

interface ActivityCampaignCardProps {
  campaign: RewardCampaign;
}

const ActivityCampaignCard: React.FC<ActivityCampaignCardProps> = ({ campaign }) => {
  const { t } = useTranslation();
  const [imgFailed, setImgFailed] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!campaign.endAt || campaign.isLongTerm) return undefined;
    const id = window.setInterval(() => setTick((x) => x + 1), 1000);
    return () => window.clearInterval(id);
  }, [campaign.endAt, campaign.isLongTerm]);

  const countdownText = useMemo(() => {
    if (campaign.isLongTerm || !campaign.endAt) return '';
    const end = new Date(campaign.endAt).getTime();
    const left = end - Date.now();
    if (left <= 0) return t('rewards.endedCountdown');
    return formatCountdown(left);
  }, [campaign.endAt, campaign.isLongTerm, tick, t]);

  const title = t(`rewards.campaigns.${campaign.i18nKey}.title`);
  const desc = t(`rewards.campaigns.${campaign.i18nKey}.desc`);
  const categoryLabel = t(`rewards.categories.${campaign.category}`);
  const statusLabel = t(`rewards.status.${campaign.tab}`);

  const handleBagsClick = () => {
    if (campaign.externalUrl) openBagsOutbound(campaign.externalUrl);
  };

  const accentHover = ACCENT_TITLE_HOVER[campaign.accent];
  const catBg = CATEGORY_BADGE[campaign.category];
  const stBg = STATUS_BADGE[campaign.tab];

  const ctaBagsClasses =
    'w-full bg-slate-800 hover:bg-indigo-600 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-indigo-500 text-white';
  const ctaPrimaryClasses =
    'w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-semibold transition-all text-white';
  const ctaSecondaryClasses =
    'w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-semibold transition-all border border-slate-700 text-white';

  const renderCta = () => {
    if (campaign.cta === 'bags_external') {
      if (campaign.id === 'bags-creator') {
        return (
          <button type="button" className={ctaBagsClasses} onClick={handleBagsClick}>
            <span>{t('rewards.cta.creator')}</span>
            <i className="fas fa-arrow-right text-sm opacity-90" aria-hidden />
          </button>
        );
      }
      return (
        <button type="button" className={ctaBagsClasses} onClick={handleBagsClick}>
          <span>{t('rewards.cta.goBags')}</span>
          <i className="fas fa-external-link-alt text-sm opacity-90" aria-hidden />
        </button>
      );
    }
    const href = campaign.internalHref || '/';
    let label = t('rewards.cta.join');
    if (campaign.id === 'node-mining') label = t('rewards.cta.viewTasks');
    if (campaign.id === 'newbie-wallet') label = t('rewards.cta.claim');
    if (campaign.id === 'referral') label = t('rewards.cta.invite');
    const isPrimary = campaign.id === 'dao-may';
    return (
      <Link
        to={href}
        className={`${isPrimary ? ctaPrimaryClasses : ctaSecondaryClasses} flex items-center justify-center`}
      >
        {label}
      </Link>
    );
  };

  const showMetaRow = campaign.participants != null || !!countdownText || campaign.isLongTerm;

  return (
    <article
      className={`${styles.campaignCard} group relative ${campaign.tab === 'ended' ? 'opacity-90 hover:opacity-100' : ''}`}
    >
      {campaign.hot ? (
        <div className="absolute top-0 right-0 z-10 rounded-bl-lg bg-amber-400 px-3 py-1 text-[10px] font-bold text-black">
          {t('rewards.hot')}
        </div>
      ) : null}
      <div className="relative h-48 overflow-hidden bg-slate-900">
        {!imgFailed ? (
          <img
            src={campaign.imageUrl}
            alt=""
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              campaign.id === 'newbie-wallet' ? 'grayscale transition-all group-hover:grayscale-0' : ''
            }`}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-indigo-950">
            <i className="fas fa-image text-3xl text-slate-600" aria-hidden />
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${catBg}`}>
            {categoryLabel}
          </span>
          <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${stBg}`}>
            {statusLabel}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className={`mb-2 text-xl font-bold text-white transition-colors ${accentHover}`}>{title}</h3>
        <p className="mb-6 line-clamp-2 text-sm text-slate-400">{desc}</p>
        <div className="mt-auto space-y-4">
          {showMetaRow ? (
            <div className="flex items-center justify-between text-xs">
              {campaign.participants != null ? (
                <span className="flex items-center text-slate-500">
                  <i className="fas fa-users mr-1" aria-hidden />
                  {t('rewards.participants', { count: campaign.participants })}
                </span>
              ) : (
                <span />
              )}
              {campaign.isLongTerm ? (
                <span className="flex items-center font-mono text-slate-500">{t('rewards.longTerm')}</span>
              ) : countdownText ? (
                <span className="flex items-center font-mono text-indigo-400">
                  <i className="fas fa-clock mr-1" aria-hidden />
                  {countdownText}
                </span>
              ) : null}
            </div>
          ) : null}
          {renderCta()}
        </div>
      </div>
    </article>
  );
};

export default ActivityCampaignCard;
