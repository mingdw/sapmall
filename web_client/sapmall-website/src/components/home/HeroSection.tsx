import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Rocket, BookOpen, Play } from 'lucide-react';
import RevealOnScroll from '../RevealOnScroll';
import ActionButton from './ActionButton';
import { siteLinks } from '../../config/siteLinks';
import { staggerDelay } from '../../utils/motion';

type HeroStats = {
  tvl: number;
  users: number;
  transactions: number;
  apy: number;
};

type HeroSectionProps = {
  onLaunchDApp: () => void;
};

const TARGET_STATS = { tvl: 124800, users: 8472, transactions: 44830, apy: 14 };

const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchDApp }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<HeroStats>({ tvl: 0, users: 0, transactions: 0, apy: 0 });

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setStats(TARGET_STATS);
      return;
    }

    const duration = 2000;
    const steps = 100;
    const stepDuration = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        tvl: Math.floor(TARGET_STATS.tvl * progress),
        users: Math.floor(TARGET_STATS.users * progress),
        transactions: Math.floor(TARGET_STATS.transactions * progress),
        apy: Math.floor(TARGET_STATS.apy * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    return () => clearInterval(timer);
  }, []);

  const statCards = [
    { value: `$${stats.tvl.toLocaleString()}`, label: t('stats.tvl'), hint: t('stats.tvlChange') },
    { value: stats.users.toLocaleString(), label: t('stats.activeUsers'), hint: t('stats.usersChange') },
    { value: stats.transactions.toLocaleString(), label: t('stats.transactions'), hint: t('stats.transactionsChange') },
    { value: `${stats.apy}%`, label: t('stats.apy'), hint: t('stats.contributorRewards') },
  ];

  return (
    <section id="home" className="hero-section section-anchor">
      <div className="site-container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <RevealOnScroll variant="left" delay={0}>
              <p className="hero-eyebrow">Sapphire Mall</p>
            </RevealOnScroll>
            <RevealOnScroll variant="left" delay={staggerDelay(1)}>
              <h1 className="hero-title">{t('hero.title')}</h1>
            </RevealOnScroll>
            <RevealOnScroll variant="left" delay={staggerDelay(2)}>
              <p className="hero-subtitle">{t('hero.subtitle')}</p>
            </RevealOnScroll>
            <RevealOnScroll variant="left" delay={staggerDelay(3)}>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="chip">{t('hero.features.revenueSharing')}</span>
                <span className="chip">{t('hero.features.multiChain')}</span>
              </div>
            </RevealOnScroll>
            <RevealOnScroll variant="left" delay={staggerDelay(4)}>
              <div className="flex flex-col sm:flex-row gap-3">
                <ActionButton icon={Rocket} variant="primary" size="lg" onClick={onLaunchDApp}>
                  {t('hero.buttons.startTrading')}
                </ActionButton>
                <ActionButton icon={BookOpen} variant="outline-accent" size="lg" href={siteLinks.whitepaper} external>
                  {t('hero.buttons.readWhitepaper')}
                </ActionButton>
                <ActionButton icon={Play} variant="outline-muted" size="lg" href={siteLinks.demo} external>
                  {t('hero.buttons.watchDemo')}
                </ActionButton>
              </div>
            </RevealOnScroll>
          </div>

          <div>
            <RevealOnScroll variant="right" delay={staggerDelay(1)}>
              <p className="stats-disclaimer mb-3">{t('stats.disclaimer')}</p>
            </RevealOnScroll>
            <div className="grid grid-cols-2 gap-4">
              {statCards.map((card, index) => (
                <RevealOnScroll key={card.label} variant="right" delay={staggerDelay(index + 2)}>
                  <div className="stat-card">
                    <div className="text-2xl md:text-3xl stats-counter mb-1">{card.value}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{card.label}</div>
                    <div className="text-xs text-brand-600 mt-1">{card.hint}</div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
