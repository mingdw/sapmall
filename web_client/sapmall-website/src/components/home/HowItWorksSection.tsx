import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Wallet, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import RevealOnScroll from '../RevealOnScroll';
import DappPreviewFrame from './DappPreviewFrame';

const STEP_ICONS: LucideIcon[] = [ShoppingBag, Wallet, CheckCircle2];

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();
  const steps = t('howItWorks.steps', { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <section id="how-it-works" className="section-muted section-padding">
      <div className="site-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <RevealOnScroll className="mb-10 max-w-xl">
              <p className="section-eyebrow">{t('nav.howItWorks')}</p>
              <h2 className="section-title">{t('howItWorks.title')}</h2>
              <p className="section-desc">{t('howItWorks.subtitle')}</p>
            </RevealOnScroll>

            <ol className="steps-list">
              {steps.map((step, index) => {
                const Icon = STEP_ICONS[index] ?? CheckCircle2;
                return (
                  <RevealOnScroll key={step.title} delay={index * 70}>
                    <li className="step-item">
                      <div className="step-item__index">{t('common.step')} {index + 1}</div>
                      <div className="step-item__icon">
                        <Icon size={20} strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 className="step-item__title">{step.title}</h3>
                        <p className="step-item__desc">{step.desc}</p>
                      </div>
                    </li>
                  </RevealOnScroll>
                );
              })}
            </ol>
          </div>

          <RevealOnScroll delay={100}>
            <DappPreviewFrame caption={t('howItWorks.previewCaption')} />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
