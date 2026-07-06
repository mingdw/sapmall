import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBag,
  Wallet,
  CheckCircle2,
  Coins,
  Vote,
  Globe,
  Shield,
  Layers,
  TrendingUp,
  FileCode2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import RevealOnScroll from '../RevealOnScroll';
import FeatureCard from './FeatureCard';
import { staggerDelay } from '../../utils/motion';
import DappPreviewFrame from './DappPreviewFrame';
import NetworkTokenPanel from './NetworkTokenPanel';

const STEP_ICONS: LucideIcon[] = [ShoppingBag, Wallet, CheckCircle2];
const TRUST_ICONS: LucideIcon[] = [Shield, Layers, FileCode2];

/** 平台功能：核心能力 → 支持网络 → 如何使用 → 安全与透明 */
const PlatformFeaturesSection: React.FC = () => {
  const { t } = useTranslation();
  const steps = t('howItWorks.steps', { returnObjects: true }) as { title: string; desc: string }[];
  const badges = t('trust.badges', { returnObjects: true }) as { title: string; desc: string }[];
  const [previewStep, setPreviewStep] = useState(0);

  const capabilities = [
    { icon: Coins, title: t('features.contributionRewards.title'), desc: t('features.contributionRewards.desc'), highlight: t('features.contributionRewards.highlight') },
    { icon: Vote, title: t('features.daoGovernance.title'), desc: t('features.daoGovernance.desc'), highlight: t('features.daoGovernance.highlight') },
    { icon: Globe, title: t('features.globalMarketplace.title'), desc: t('features.globalMarketplace.desc'), highlight: t('features.globalMarketplace.highlight') },
    { icon: Shield, title: t('features.secureTrading.title'), desc: t('features.secureTrading.desc'), highlight: t('features.secureTrading.highlight') },
    { icon: Layers, title: t('features.multiAsset.title'), desc: t('features.multiAsset.desc'), highlight: t('features.multiAsset.highlight') },
    { icon: TrendingUp, title: t('features.analytics.title'), desc: t('features.analytics.desc'), highlight: t('features.analytics.highlight') },
  ];

  return (
    <section id="features" className="section-block section-block--alt section-anchor">
      <div className="site-container">
        <RevealOnScroll variant="up" className="section-header">
          <p className="section-eyebrow">{t('nav.features')}</p>
          <h2 className="section-title">{t('features.title')}</h2>
          <p className="section-desc">{t('features.subtitle')}</p>
        </RevealOnScroll>

        {/* 核心能力：3 行 × 2 列等宽卡片 */}
        <div className="section-subblock section-subblock--first">
          <RevealOnScroll variant="fade" className="section-subblock__header">
            <h3 className="section-subblock__title">{t('features.subsections.capabilities.title')}</h3>
            <p className="section-subblock__desc">{t('features.subsections.capabilities.subtitle')}</p>
          </RevealOnScroll>

          <div className="capability-grid">
            {capabilities.map((item, index) => (
              <FeatureCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                highlight={item.highlight}
                delay={staggerDelay(index)}
              />
            ))}
          </div>
        </div>

        {/* 支持网络与代币 */}
        <div className="section-subblock">
          <RevealOnScroll variant="fade" className="section-subblock__header">
            <h3 className="section-subblock__title">{t('features.subsections.networks.title')}</h3>
            <p className="section-subblock__desc">{t('features.subsections.networks.subtitle')}</p>
          </RevealOnScroll>

          <NetworkTokenPanel />
        </div>

        {/* 如何使用 */}
        <div className="section-subblock">
          <RevealOnScroll variant="fade" className="section-subblock__header">
            <h3 className="section-subblock__title">{t('features.subsections.howItWorks.title')}</h3>
            <p className="section-subblock__desc">{t('features.subsections.howItWorks.subtitle')}</p>
          </RevealOnScroll>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <ol className="steps-list">
              {steps.map((step, index) => {
                const Icon = STEP_ICONS[index] ?? CheckCircle2;
                return (
                  <RevealOnScroll key={step.title} variant="left" delay={staggerDelay(index)}>
                    <li>
                      <button
                        type="button"
                        className={`step-item step-item--interactive ${previewStep === index ? 'step-item--active' : ''}`}
                        onClick={() => setPreviewStep(index)}
                        aria-pressed={previewStep === index}
                      >
                        <div className="step-item__index">
                          {t('common.step')} {index + 1}
                        </div>
                        <div className="step-item__icon">
                          <Icon size={20} strokeWidth={1.75} />
                        </div>
                        <div>
                          <h4 className="step-item__title">{step.title}</h4>
                          <p className="step-item__desc">{step.desc}</p>
                        </div>
                      </button>
                    </li>
                  </RevealOnScroll>
                );
              })}
            </ol>

            <RevealOnScroll variant="right" delay={staggerDelay(1)}>
              <DappPreviewFrame activeStep={previewStep} caption={t('howItWorks.previewCaption')} />
            </RevealOnScroll>
          </div>
        </div>

        {/* 安全与透明 */}
        <div className="section-subblock section-subblock--last">
          <RevealOnScroll variant="fade" className="section-subblock__header">
            <h3 className="section-subblock__title">{t('features.subsections.trust.title')}</h3>
            <p className="section-subblock__desc">{t('features.subsections.trust.subtitle')}</p>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-5">
            {badges.map((badge, index) => {
              const Icon = TRUST_ICONS[index] ?? Shield;
              return (
                <RevealOnScroll key={badge.title} variant="up" delay={staggerDelay(index)}>
                  <div className="surface-card h-full text-center">
                    <div className="icon-box icon-box--lg mx-auto mb-4">
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <h4 className="font-semibold mb-2">{badge.title}</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">{badge.desc}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformFeaturesSection;
