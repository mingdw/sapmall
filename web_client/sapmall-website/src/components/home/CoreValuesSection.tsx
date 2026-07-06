import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Eye, Heart, Percent, Shield, Users, Globe, TrendingUp } from 'lucide-react';
import RevealOnScroll from '../RevealOnScroll';
import { staggerDelay } from '../../utils/motion';

const CoreValuesSection: React.FC = () => {
  const { t } = useTranslation();

  const advantages = [
    { icon: Percent, title: t('coreValues.advantages.revenueSharing.title'), desc: t('coreValues.advantages.revenueSharing.desc') },
    { icon: Shield, title: t('coreValues.advantages.security.title'), desc: t('coreValues.advantages.security.desc') },
    { icon: Users, title: t('coreValues.advantages.governance.title'), desc: t('coreValues.advantages.governance.desc') },
    { icon: Globe, title: t('coreValues.advantages.ecosystem.title'), desc: t('coreValues.advantages.ecosystem.desc') },
  ];

  const businessBlocks = [
    { title: t('coreValues.business.opportunity.title'), items: t('coreValues.business.opportunity.items', { returnObjects: true }) as string[] },
    { title: t('coreValues.business.advantages.title'), items: t('coreValues.business.advantages.items', { returnObjects: true }) as string[] },
    { title: t('coreValues.business.roadmap.title'), items: t('coreValues.business.roadmap.items', { returnObjects: true }) as string[] },
  ];

  return (
    <section id="core-values" className="section-block section-block--alt section-anchor">
      <div className="site-container">
        <RevealOnScroll variant="up" className="section-header">
          <p className="section-eyebrow">{t('nav.coreValues')}</p>
          <h2 className="section-title">{t('coreValues.title')}</h2>
          <p className="section-desc">{t('coreValues.subtitle')}</p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <RevealOnScroll variant="up" delay={0}>
            <div className="surface-card h-full">
              <div className="card-head card-head--lg">
                <span className="card-head__icon" aria-hidden><Target strokeWidth={2.25} /></span>
                <h3 className="card-head__title">{t('coreValues.mission.title')}</h3>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">{t('coreValues.mission.content')}</p>
              <div className="flex items-center gap-2 text-brand-600 font-medium text-sm">
                <Heart size={16} strokeWidth={1.75} />
                <span>{t('coreValues.mission.tagline')}</span>
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <div className="surface-card h-full">
              <div className="card-head card-head--lg">
                <span className="card-head__icon" aria-hidden><Eye strokeWidth={2.25} /></span>
                <h3 className="card-head__title">{t('coreValues.vision.title')}</h3>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">{t('coreValues.vision.content')}</p>
              <div className="flex items-center gap-2 text-brand-600 font-medium text-sm">
                <TrendingUp size={16} strokeWidth={1.75} />
                <span>{t('coreValues.vision.tagline')}</span>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll className="mb-10">
          <h3 className="text-2xl font-semibold">{t('coreValues.advantages.title')}</h3>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {advantages.map((item, index) => (
            <RevealOnScroll key={item.title} delay={index * 60}>
              <div className="surface-card flex gap-4 items-start">
                <div className="icon-box"><item.icon size={20} strokeWidth={1.75} /></div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="mb-10">
          <h3 className="text-2xl font-semibold">{t('coreValues.business.title')}</h3>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-5">
          {businessBlocks.map((block, index) => (
            <RevealOnScroll key={block.title} delay={index * 60}>
              <div className="surface-card h-full">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-600 mb-4">{block.title}</h4>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-brand-500 shrink-0">·</span>
                      <span>{item.replace(/^[•·]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
