import React from 'react';
import { useTranslation } from 'react-i18next';
import RevealOnScroll from '../RevealOnScroll';
import { staggerDelay } from '../../utils/motion';

const RoadmapSection: React.FC = () => {
  const { t } = useTranslation();
  const phases = t('roadmap.phases', { returnObjects: true }) as {
    period: string;
    title: string;
    items: string[];
  }[];

  return (
    <section id="roadmap" className="section-block section-block--alt section-anchor">
      <div className="site-container">
        <RevealOnScroll variant="up" className="section-header">
          <p className="section-eyebrow">{t('nav.roadmap')}</p>
          <h2 className="section-title">{t('roadmap.title')}</h2>
          <p className="section-desc">{t('roadmap.subtitle')}</p>
        </RevealOnScroll>

        <div className="roadmap-timeline">
          {phases.map((phase, index) => (
            <RevealOnScroll key={phase.period} delay={index * 80}>
              <article className="roadmap-phase">
                <div className="roadmap-phase__marker" aria-hidden />
                <div className="roadmap-phase__content surface-card">
                  <time className="roadmap-phase__period">{phase.period}</time>
                  <h3 className="text-lg font-semibold mb-3">{phase.title}</h3>
                  <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                    {phase.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-brand-500 shrink-0">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
