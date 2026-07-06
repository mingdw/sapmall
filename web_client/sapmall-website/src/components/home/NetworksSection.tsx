import React from 'react';
import { useTranslation } from 'react-i18next';
import RevealOnScroll from '../RevealOnScroll';
import { supportedChains, supportedTokens } from '../../config/siteLinks';

const NetworksSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="networks" className="section-padding">
      <div className="site-container">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="section-eyebrow">{t('nav.networks')}</p>
          <h2 className="section-title">{t('networks.title')}</h2>
          <p className="section-desc">{t('networks.subtitle')}</p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-6">
          <RevealOnScroll>
            <div className="surface-card h-full">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-600 mb-4">
                {t('networks.chainsLabel')}
              </h3>
              <ul className="network-chip-list">
                {supportedChains.map((chain) => (
                  <li key={chain.id} className="network-chip">
                    <span className="network-chip__name">{chain.name}</span>
                    <span className="network-chip__meta">ID {chain.id}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={80}>
            <div className="surface-card h-full">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-600 mb-4">
                {t('networks.tokensLabel')}
              </h3>
              <div className="token-chip-row">
                {supportedTokens.map((token) => (
                  <span key={token} className="token-chip">{token}</span>
                ))}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mt-4">{t('networks.tokensNote')}</p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default NetworksSection;
