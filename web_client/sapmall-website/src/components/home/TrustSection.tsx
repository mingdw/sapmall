import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Layers, FileCode2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import RevealOnScroll from '../RevealOnScroll';

const TRUST_ICONS: LucideIcon[] = [Shield, Layers, FileCode2];

const TrustSection: React.FC = () => {
  const { t } = useTranslation();
  const badges = t('trust.badges', { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <section id="trust" className="section-muted section-padding">
      <div className="site-container">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="section-eyebrow">{t('trust.eyebrow')}</p>
          <h2 className="section-title">{t('trust.title')}</h2>
          <p className="section-desc">{t('trust.subtitle')}</p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-5">
          {badges.map((badge, index) => {
            const Icon = TRUST_ICONS[index] ?? Shield;
            return (
              <RevealOnScroll key={badge.title} delay={index * 60}>
                <div className="surface-card h-full text-center">
                  <div className="icon-box icon-box--lg mx-auto mb-4">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-semibold mb-2">{badge.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{badge.desc}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
