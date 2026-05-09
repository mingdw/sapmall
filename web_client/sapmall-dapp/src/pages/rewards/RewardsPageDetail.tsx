import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import styles from './RewardsPageDetail.module.scss';
import ActivityCampaignCard from './ActivityCampaignCard';
import { REWARD_CAMPAIGNS, type RewardCampaignTab } from './rewardsCampaignMock';

type SortKey = 'latest' | 'reward' | 'deadline';

const RewardsPageDetail: React.FC = () => {
  const { t, ready } = useTranslation();
  const [tab, setTab] = useState<RewardCampaignTab>('ongoing');
  const [sortKey, setSortKey] = useState<SortKey>('latest');
  const [subscribeEmail, setSubscribeEmail] = useState('');

  const counts = useMemo(() => {
    const ongoing = REWARD_CAMPAIGNS.filter((c) => c.tab === 'ongoing').length;
    const upcoming = REWARD_CAMPAIGNS.filter((c) => c.tab === 'upcoming').length;
    const ended = REWARD_CAMPAIGNS.filter((c) => c.tab === 'ended').length;
    return { ongoing, upcoming, ended };
  }, []);

  const filtered = useMemo(() => REWARD_CAMPAIGNS.filter((c) => c.tab === tab), [tab]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortKey === 'deadline') {
      list.sort((a, b) => {
        const ta = a.endAt ? new Date(a.endAt).getTime() : Number.POSITIVE_INFINITY;
        const tb = b.endAt ? new Date(b.endAt).getTime() : Number.POSITIVE_INFINITY;
        return ta - tb;
      });
    } else if (sortKey === 'reward') {
      list.sort((a, b) => (b.participants ?? 0) - (a.participants ?? 0));
    }
    return list;
  }, [filtered, sortKey]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail.trim()) return;
    message.info(t('rewards.subscribeToast'));
    setSubscribeEmail('');
  };

  if (!ready) {
    return (
      <div className="p-6 text-sm text-gray-400" aria-busy="true">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className={`relative ${styles.rewardsPageRoot} pb-10`}>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-8">
        {/* 标题区 */}
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <h1 className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {t('rewards.title')}
            </h1>
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">
              {t('rewards.badgeHub')}
            </span>
          </div>
          <p className="max-w-2xl text-lg text-slate-400">{t('rewards.heroSubtitle')}</p>
        </header>

        {/* 钱包说明 */}
        <section className="mb-10" aria-labelledby="rewards-wallet-notice">
          <div className="flex gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 sm:p-6">
            <div className="shrink-0 rounded-lg bg-amber-500/20 p-2">
              <i className="fas fa-info-circle text-2xl text-amber-400" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="rewards-wallet-notice" className="mb-2 font-semibold text-amber-400">
                {t('rewards.walletNoticeTitle')}
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                <span className="block">{t('rewards.walletNoticeLine1')}</span>
                <span className="mt-2 block">{t('rewards.walletNoticeLine2')}</span>
                <span className="mt-2 block">{t('rewards.walletNoticeLine3')}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Tabs + 排序 */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-0">
          <div className={styles.tabRail} role="tablist" aria-label={t('rewards.tabListAria')}>
            {(['ongoing', 'upcoming', 'ended'] as const).map((key) => {
              const active = tab === key;
              const count = counts[key];
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`${styles.tabButton} ${active ? styles.tabButtonActive : ''}`}
                  onClick={() => setTab(key)}
                >
                  {t(`rewards.tabs.${key}`, { count })}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-400">{t('rewards.sortLabel')}</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="latest">{t('rewards.sortLatest')}</option>
              <option value="reward">{t('rewards.sortReward')}</option>
              <option value="deadline">{t('rewards.sortDeadline')}</option>
            </select>
          </div>
        </div>

        {/* 活动卡片 */}
        {sorted.length === 0 ? (
          <div className={`${styles.glassCard} rounded-2xl p-12 text-center text-slate-400`}>{t('rewards.empty')}</div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((c) => (
              <ActivityCampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}

        {/* 未来规划 + 订阅 */}
        <section className="mt-20 lg:mt-24" aria-labelledby="rewards-future-title">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 id="rewards-future-title" className="text-2xl font-bold text-white sm:text-3xl">
                {t('rewards.futureTitle')}
              </h2>
              <p className="leading-relaxed text-slate-400">{t('rewards.futureDesc')}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className={`${styles.glassCard} rounded-xl p-4`}>
                  <i className="fas fa-list-check mb-2 text-2xl text-indigo-400" aria-hidden />
                  <h3 className="font-bold text-white">{t('rewards.featureTodo')}</h3>
                  <p className="mt-1 text-xs text-slate-500">{t('rewards.featureTodoDesc')}</p>
                </div>
                <div className={`${styles.glassCard} rounded-xl p-4`}>
                  <i className="fas fa-trophy mb-2 text-2xl text-amber-400" aria-hidden />
                  <h3 className="font-bold text-white">{t('rewards.featureLeaderboard')}</h3>
                  <p className="mt-1 text-xs text-slate-500">{t('rewards.featureLeaderboardDesc')}</p>
                </div>
              </div>
            </div>
            <div className={`${styles.glassCard} rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 sm:p-8`}>
              <h3 className="mb-6 flex items-center text-xl font-bold text-white">
                <i className="fas fa-envelope mr-2 text-indigo-400" aria-hidden />
                {t('rewards.subscribeTitle')}
              </h3>
              <p className="mb-6 text-sm text-slate-400">{t('rewards.subscribeDesc')}</p>
              <form onSubmit={onSubscribe} className="flex flex-col gap-2 sm:flex-row sm:space-x-2">
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder={t('rewards.subscribePlaceholder')}
                  className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-all hover:bg-indigo-500"
                >
                  {t('rewards.subscribeButton')}
                </button>
              </form>
            </div>
          </div>
        </section>

        <p className="mt-10 text-center text-sm text-slate-500">{t('rewards.plannedHint')}</p>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-28 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-white shadow-lg transition-transform hover:scale-110 sm:right-8"
        aria-label={t('rewards.scrollTopAria')}
      >
        <i className="fas fa-arrow-up" aria-hidden />
      </button>
    </div>
  );
};

export default RewardsPageDetail;
