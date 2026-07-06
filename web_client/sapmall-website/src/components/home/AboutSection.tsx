import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle,
  Lightbulb,
  Handshake,
  Heart,
} from 'lucide-react';
import RevealOnScroll from '../RevealOnScroll';

const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="section-block section-block--alt section-anchor">
      <div className="site-container">
        <RevealOnScroll variant="up" className="section-header">
          <p className="section-eyebrow">{t('nav.about')}</p>
          <h2 className="section-title">{t('about.title')}</h2>
          <p className="section-desc">{t('about.subtitle')}</p>
        </RevealOnScroll>

        {/* 团队介绍 */}
        <div className="section-subblock section-subblock--first">
          <RevealOnScroll variant="fade" className="section-subblock__header">
            <h3 className="section-subblock__title">{t('about.subsections.team.title')}</h3>
            <p className="section-subblock__desc">{t('about.subsections.team.subtitle')}</p>
          </RevealOnScroll>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <RevealOnScroll variant="up">
              <div className="surface-card h-full">
                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">{t('about.team.content')}</p>
                <div className="space-y-4">
                  {[
                    { title: t('about.team.expertise.title'), desc: t('about.team.expertise.desc') },
                    { title: t('about.team.experience.title'), desc: t('about.team.experience.desc') },
                    { title: t('about.team.vision.title'), desc: t('about.team.vision.desc') },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <CheckCircle size={18} className="text-brand-500 mt-0.5 shrink-0" strokeWidth={1.75} />
                      <div>
                        <h4 className="font-semibold mb-0.5">{item.title}</h4>
                        <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll variant="up" delay={80}>
              <div className="about-image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop&crop=center"
                  alt={t('about.title')}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* 我们的价值观 */}
        <div className="section-subblock section-subblock--last">
          <RevealOnScroll variant="fade" className="section-subblock__header">
            <h3 className="section-subblock__title">{t('about.subsections.values.title')}</h3>
            <p className="section-subblock__desc">{t('about.subsections.values.subtitle')}</p>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Lightbulb, title: t('about.values.innovation.title'), desc: t('about.values.innovation.desc') },
              { icon: Handshake, title: t('about.values.userFirst.title'), desc: t('about.values.userFirst.desc') },
              { icon: Heart, title: t('about.values.community.title'), desc: t('about.values.community.desc') },
            ].map((item, index) => (
              <RevealOnScroll key={item.title} variant="up" delay={index * 70}>
                <div className="surface-card text-center h-full">
                  <div className="icon-box icon-box--lg mx-auto mb-4"><item.icon size={20} strokeWidth={1.75} /></div>
                  <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
