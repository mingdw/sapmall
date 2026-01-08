import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DaoPageDetail.module.scss';

type ProposalStatus = 'all' | 'active' | 'ended' | 'upcoming';

const DaoPageDetail: React.FC = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<ProposalStatus>('all');

  const ticker = useMemo(
    () => [
      { date: '2024-05-28', text: 'Sapphire DAO 治理V2上线' },
      { date: '2024-05-28', text: 'NFT市场投票提案通过' },
      { date: '2024-06-01', text: '社区贡献任务上线' },
      { date: '2024-06-01', text: '治理参数调整提案发布' }
    ],
    []
  );

  const stats = useMemo(
    () => [
      { label: t('dao.stats.treasury', { defaultValue: '治理代币总量' }), value: '2,456,789', unit: 'SAP', tone: 'blue' as const },
      { label: t('dao.stats.proposals', { defaultValue: '活跃提案数' }), value: '15', unit: '', tone: 'purple' as const },
      { label: t('dao.stats.participation', { defaultValue: '参与率' }), value: '68.5%', unit: '', tone: 'green' as const },
      { label: t('dao.stats.members', { defaultValue: 'DAO成员数' }), value: '1,856', unit: '', tone: 'yellow' as const }
    ],
    [t]
  );

  const proposals = useMemo(
    () => [
      {
        id: 'p1',
        title: '降低交易手续费至 0.05%',
        tags: ['投票中', '费率', '奖励 50 SAP'],
        desc: '提案将平台交易手续费从当前的0.1%调整至0.05%，以提升交易体验并吸引更多用户参与。',
        progress: 0.72,
        votes: { for: 1234, against: 567, abstain: 45 },
        endsIn: '剩余 2天'
      },
      {
        id: 'p2',
        title: '新增“社区商品审核”激励规则',
        tags: ['进行中', '审核', '奖励 80 SAP'],
        desc: '为高质量的商品审核贡献者提供额外奖励，按周结算，提升商品质量与审核效率。',
        progress: 0.54,
        votes: { for: 980, against: 321, abstain: 27 },
        endsIn: '剩余 5天'
      }
    ],
    []
  );

  const filteredProposals = useMemo(() => {
    if (status === 'all') return proposals;
    if (status === 'active') return proposals.slice(0, 2);
    if (status === 'ended') return [];
    if (status === 'upcoming') return [];
    return proposals;
  }, [proposals, status]);

  const leaderboard = useMemo(
    () => [
      { addr: '0x1234...abcd', score: 32 },
      { addr: '0x5678...ef12', score: 28 },
      { addr: '0x9abc...3456', score: 25 },
      { addr: '0x7890...cdef', score: 22 },
      { addr: '0x1111...2222', score: 20 }
    ],
    []
  );

  return (
    <div className="py-4">
      {/* 顶部公告跑马灯 */}
      <div className={styles.ticker}>
        <div className={styles.tickerInner}>
          {ticker.concat(ticker).map((item, idx) => (
            <span key={idx} className={styles.tickerItem}>
              <span className={styles.tickerDate}>{item.date}</span>
              <span className={styles.tickerText}>{item.text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 头部标题 + 右侧图表 */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <div className={styles.hero}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              {t('dao.title', { defaultValue: 'DAO 治理 · 共识驱动' })}
            </h1>
            <p className="mt-2 text-gray-300 leading-relaxed max-w-3xl">
              {t('dao.subtitle', { defaultValue: 'Sapphire Mall DAO —— 让每一份共识都能转化为社区价值。参与提案、投票与讨论，共建平台未来。' })}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className={styles.primaryBtn} type="button">
                {t('dao.actions.create', { defaultValue: '创建提案' })}
              </button>
              <button className={styles.secondaryBtn} type="button">
                {t('dao.actions.explore', { defaultValue: '浏览提案' })}
              </button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className={`${styles.statCard} ${styles[`tone_${s.tone}`]}`}>
                <div className={styles.statValue}>
                  {s.value}
                  {s.unit ? <span className={styles.statUnit}>{s.unit}</span> : null}
                </div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* 活跃提案 */}
          <div className={`${styles.glassCard} mt-4`}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <i className="fas fa-fire text-blue-400"></i>
                <span className="text-sm font-bold text-gray-200">{t('dao.activeProposals', { defaultValue: '活跃提案' })}</span>
              </div>
              <div className={styles.filterPills}>
                <button className={`${styles.pill} ${status === 'all' ? styles.pillActive : ''}`} onClick={() => setStatus('all')} type="button">
                  {t('dao.filters.all', { defaultValue: '全部' })}
                </button>
                <button className={`${styles.pill} ${status === 'active' ? styles.pillActive : ''}`} onClick={() => setStatus('active')} type="button">
                  {t('dao.filters.active', { defaultValue: '活跃' })}
                </button>
                <button className={`${styles.pill} ${status === 'ended' ? styles.pillActive : ''}`} onClick={() => setStatus('ended')} type="button">
                  {t('dao.filters.ended', { defaultValue: '已结束' })}
                </button>
                <button className={`${styles.pill} ${status === 'upcoming' ? styles.pillActive : ''}`} onClick={() => setStatus('upcoming')} type="button">
                  {t('dao.filters.upcoming', { defaultValue: '未开始' })}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredProposals.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">{t('dao.empty', { defaultValue: '暂无匹配的提案' })}</div>
              ) : (
                filteredProposals.map((p) => (
                  <div key={p.id} className={styles.proposalCard}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={styles.proposalAvatar}></div>
                          <div className="min-w-0">
                            <div className="text-white font-extrabold truncate">{p.title}</div>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {p.tags.map((tag) => (
                                <span key={tag} className={styles.tag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{p.desc}</p>
                        <div className="mt-3">
                          <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${Math.round(p.progress * 100)}%` }} />
                          </div>
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                            <span>
                              {t('dao.votes', { defaultValue: '投票' })}: {p.votes.for} / {p.votes.against} / {p.votes.abstain}
                            </span>
                            <span>{p.endsIn}</span>
                          </div>
                        </div>
                      </div>

                      <button className={styles.voteBtn} type="button">
                        {t('dao.vote', { defaultValue: '参与投票' })}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 右侧：趋势图 + 活跃用户榜 */}
        <div className="xl:col-span-4 space-y-4">
          <div className={styles.glassCard}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-gray-200">{t('dao.trend', { defaultValue: '治理趋势' })}</div>
              <button type="button" className={styles.smallPill}>
                {t('dao.last30d', { defaultValue: '最近30天' })}
              </button>
            </div>
            <div className={styles.chartBox}>
              <div className="flex h-full items-center justify-center text-gray-400">
                <i className="fas fa-chart-line mr-2 opacity-70"></i>
                <span className="text-sm font-semibold">{t('dao.chartPlaceholder', { defaultValue: '趋势图渲染中…' })}</span>
              </div>
            </div>
          </div>

          <div className={styles.glassCard}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <i className="fas fa-bolt text-yellow-400"></i>
                <span className="text-sm font-bold text-gray-200">{t('dao.leaderboard', { defaultValue: '活跃用户榜' })}</span>
              </div>
              <div className="flex gap-2">
                <button type="button" className={styles.smallPill}>
                  {t('dao.week', { defaultValue: '最近一周' })}
                </button>
                <button type="button" className={styles.smallPillAlt}>
                  {t('dao.month', { defaultValue: '最近一月' })}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {leaderboard.map((u, idx) => (
                <div key={u.addr} className={styles.leaderRow}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={styles.rankDot}>{idx + 1}</div>
                    <div className="min-w-0">
                      <div className="text-sm text-gray-200 font-semibold truncate">{u.addr}</div>
                      <div className="text-xs text-gray-500">{t('dao.contribution', { defaultValue: '贡献度' })}</div>
                    </div>
                  </div>
                  <div className="text-green-400 font-extrabold">{u.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaoPageDetail;
