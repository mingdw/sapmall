import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import RevealOnScroll from '../RevealOnScroll';

const FaqSection: React.FC = () => {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true }) as { q: string; a: string }[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding">
      <div className="site-container max-w-3xl">
        <RevealOnScroll className="mb-10 text-center">
          <p className="section-eyebrow">{t('nav.faq')}</p>
          <h2 className="section-title">{t('faq.title')}</h2>
          <p className="section-desc mx-auto">{t('faq.subtitle')}</p>
        </RevealOnScroll>

        <div className="faq-list">
          {items.map((item, index) => {
            const open = openIndex === index;
            return (
              <RevealOnScroll key={item.q} delay={index * 50}>
                <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
                  <button
                    type="button"
                    className="faq-item__trigger"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={18} className="faq-item__chevron" strokeWidth={1.75} />
                  </button>
                  {open ? <div className="faq-item__answer">{item.a}</div> : null}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
