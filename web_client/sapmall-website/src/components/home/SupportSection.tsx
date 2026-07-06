import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  HelpCircle,
  Code2,
  ShieldCheck,
  Rocket,
  Mail,
  Headphones,
  Send,
  MessageCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import RevealOnScroll from '../RevealOnScroll';
import ActionButton from './ActionButton';
import FaqAccordionItem from './FaqAccordionItem';
import { siteLinks } from '../../config/siteLinks';
import { staggerDelay } from '../../utils/motion';

type SupportSectionProps = {
  onLaunchDApp: () => void;
};

/** 支持：常见问题、文档与资源、联系我们 */
const SupportSection: React.FC<SupportSectionProps> = ({ onLaunchDApp }) => {
  const { t } = useTranslation();
  const faqItems = t('faq.items', { returnObjects: true }) as { q: string; a: string }[];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const docCards: { icon: LucideIcon; title: string; desc: string; href: string }[] = [
    {
      icon: BookOpen,
      title: t('docsSection.cards.whitepaper.title'),
      desc: t('docsSection.cards.whitepaper.desc'),
      href: siteLinks.whitepaper,
    },
    {
      icon: HelpCircle,
      title: t('docsSection.cards.help.title'),
      desc: t('docsSection.cards.help.desc'),
      href: siteLinks.dappHelp,
    },
    {
      icon: Code2,
      title: t('docsSection.cards.github.title'),
      desc: t('docsSection.cards.github.desc'),
      href: siteLinks.github,
    },
    {
      icon: ShieldCheck,
      title: t('docsSection.cards.audit.title'),
      desc: t('docsSection.cards.audit.desc'),
      href: siteLinks.audit,
    },
  ];

  const contacts = [
    {
      icon: Mail,
      title: t('about.contact.business.title'),
      detail: t('about.contact.business.email'),
      href: `mailto:${t('about.contact.business.email')}`,
    },
    {
      icon: Headphones,
      title: t('about.contact.support.title'),
      detail: t('about.contact.support.email'),
      href: `mailto:${t('about.contact.support.email')}`,
    },
    {
      icon: Send,
      title: t('about.contact.telegram.title'),
      detail: t('about.contact.telegram.handle'),
      href: siteLinks.telegram,
      external: true,
    },
    {
      icon: MessageCircle,
      title: t('about.contact.discord.title'),
      detail: t('about.contact.discord.community'),
      href: siteLinks.discord,
      external: true,
    },
  ];

  return (
    <section id="support" className="section-block section-block--alt section-anchor">
      <div className="site-container">
        <RevealOnScroll variant="up" className="section-header">
          <p className="section-eyebrow">{t('nav.support')}</p>
          <h2 className="section-title">{t('support.title')}</h2>
          <p className="section-desc">{t('support.subtitle')}</p>
        </RevealOnScroll>

        <div className="support-stack">
          {/* 常见问题 */}
          <div className="section-subblock section-subblock--first">
            <RevealOnScroll variant="fade" className="section-subblock__header">
              <h3 className="section-subblock__title">{t('support.subsections.faq.title')}</h3>
              <p className="section-subblock__desc">{t('support.subsections.faq.subtitle')}</p>
            </RevealOnScroll>

            <div className="faq-list faq-list--support">
              {faqItems.map((item, index) => {
                const open = openIndex === index;
                return (
                  <RevealOnScroll key={item.q} variant="up" delay={staggerDelay(index, 50)}>
                    <FaqAccordionItem
                      question={item.q}
                      answer={item.a}
                      open={open}
                      onToggle={() => setOpenIndex(open ? null : index)}
                    />
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>

          {/* 文档与资源 */}
          <div className="section-subblock">
            <RevealOnScroll variant="fade" className="section-subblock__header">
              <h3 className="section-subblock__title">{t('support.subsections.docs.title')}</h3>
              <p className="section-subblock__desc">{t('support.subsections.docs.subtitle')}</p>
            </RevealOnScroll>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {docCards.map((card, index) => (
                <RevealOnScroll key={card.title} variant="up" delay={staggerDelay(index)}>
                  <a href={card.href} target="_blank" rel="noopener noreferrer" className="doc-card">
                    <div className="card-head card-head--sm">
                      <span className="card-head__icon" aria-hidden><card.icon strokeWidth={2.25} /></span>
                      <h4 className="card-head__title">{card.title}</h4>
                    </div>
                    <p className="doc-card__desc">{card.desc}</p>
                  </a>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {/* 联系我们 */}
          <div className="section-subblock section-subblock--last">
            <RevealOnScroll variant="fade" className="section-subblock__header">
              <h3 className="section-subblock__title">{t('support.subsections.contact.title')}</h3>
              <p className="section-subblock__desc">{t('support.subsections.contact.subtitle')}</p>
            </RevealOnScroll>

            <RevealOnScroll variant="up">
              <div className="surface-card">
                <div className="contact-grid mb-8">
                  {contacts.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="contact-item text-center no-underline text-inherit"
                    >
                      <div className="icon-box mx-auto mb-3">
                        <item.icon size={18} strokeWidth={1.75} />
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-[var(--color-text-secondary)]">{item.detail}</p>
                    </a>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center contact-actions">
                  <ActionButton icon={Rocket} variant="primary" onClick={onLaunchDApp}>
                    {t('about.contact.buttons.startNow')}
                  </ActionButton>
                  <ActionButton icon={Send} variant="outline-accent" href={siteLinks.telegram} external>
                    {t('about.contact.buttons.joinCommunity')}
                  </ActionButton>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
