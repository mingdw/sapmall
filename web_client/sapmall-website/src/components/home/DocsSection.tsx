import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, HelpCircle, Code2, ShieldCheck, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import RevealOnScroll from '../RevealOnScroll';
import ActionButton from './ActionButton';
import { siteLinks } from '../../config/siteLinks';

const DocsSection: React.FC<{ onLaunchDApp: () => void }> = ({ onLaunchDApp }) => {
  const { t } = useTranslation();

  const cards: { icon: LucideIcon; title: string; desc: string; href: string; external?: boolean }[] = [
    {
      icon: BookOpen,
      title: t('docsSection.cards.whitepaper.title'),
      desc: t('docsSection.cards.whitepaper.desc'),
      href: siteLinks.whitepaper,
      external: true,
    },
    {
      icon: HelpCircle,
      title: t('docsSection.cards.help.title'),
      desc: t('docsSection.cards.help.desc'),
      href: siteLinks.dappHelp,
      external: true,
    },
    {
      icon: Code2,
      title: t('docsSection.cards.github.title'),
      desc: t('docsSection.cards.github.desc'),
      href: siteLinks.github,
      external: true,
    },
    {
      icon: ShieldCheck,
      title: t('docsSection.cards.audit.title'),
      desc: t('docsSection.cards.audit.desc'),
      href: siteLinks.audit,
      external: true,
    },
  ];

  return (
    <section id="docs" className="section-muted section-padding border-t border-[var(--color-border)]">
      <div className="site-container">
        <RevealOnScroll className="max-w-2xl mb-10">
          <p className="section-eyebrow">{t('nav.docs')}</p>
          <h2 className="section-title">{t('docsSection.title')}</h2>
          <p className="section-desc">{t('docsSection.subtitle')}</p>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card, index) => (
            <RevealOnScroll key={card.title} delay={index * 60}>
              <a href={card.href} target="_blank" rel="noopener noreferrer" className="doc-card">
                <div className="icon-box mb-4">
                  <card.icon size={18} strokeWidth={1.75} />
                </div>
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{card.desc}</p>
              </a>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={120}>
          <ActionButton icon={Rocket} variant="primary" size="lg" onClick={onLaunchDApp}>
            {t('docsSection.launchDapp')}
          </ActionButton>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default DocsSection;
