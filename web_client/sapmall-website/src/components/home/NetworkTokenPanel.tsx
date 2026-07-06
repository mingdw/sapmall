import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import RevealOnScroll from '../RevealOnScroll';
import { paymentNetworks } from '../../config/siteLinks';

/** 支付网络与代币联动面板 */
const NetworkTokenPanel: React.FC = () => {
  const { t } = useTranslation();
  const activeNetworks = useMemo(() => paymentNetworks.filter((n) => n.active), []);
  const pendingNetworks = useMemo(() => paymentNetworks.filter((n) => !n.active), []);

  const [selectedId, setSelectedId] = useState(() => activeNetworks[0]?.id ?? 0);
  const selected = useMemo(
    () => activeNetworks.find((n) => n.id === selectedId) ?? activeNetworks[0],
    [activeNetworks, selectedId]
  );

  return (
    <RevealOnScroll variant="up">
      <div className="network-token-panel">
        <div className="network-token-panel__chains">
          <h4 className="network-token-panel__label">{t('networks.chainsLabel')}</h4>

          <ul className="network-chip-list" role="listbox" aria-label={t('networks.chainsLabel')}>
            {activeNetworks.map((chain) => {
              const isSelected = chain.id === selected?.id;
              return (
                <li key={chain.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`network-chip network-chip--selectable ${isSelected ? 'network-chip--active' : ''}`}
                    onClick={() => setSelectedId(chain.id)}
                  >
                    <span className="network-chip__main">
                      <span className="network-chip__name">{chain.name}</span>
                      <span className="network-chip__meta">ID {chain.id}</span>
                    </span>
                    {isSelected ? (
                      <ArrowRight size={16} className="network-chip__arrow" strokeWidth={1.75} aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          {pendingNetworks.length > 0 ? (
            <div className="network-token-panel__pending">
              <p className="network-token-panel__pending-label">{t('networks.pendingLabel')}</p>
              <ul className="network-chip-list">
                {pendingNetworks.map((chain) => (
                  <li key={chain.id}>
                    <div className="network-chip network-chip--disabled" aria-disabled="true">
                      <span className="network-chip__main">
                        <span className="network-chip__name">{chain.name}</span>
                        <span className="network-chip__meta">ID {chain.id}</span>
                      </span>
                      <span className="network-chip__badge">{t('networks.pendingBadge')}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="network-token-panel__connector" aria-hidden>
          <div className="network-token-panel__connector-line" />
        </div>

        <div className="network-token-panel__tokens">
          <h4 className="network-token-panel__label">{t('networks.tokensLabel')}</h4>
          <p className="network-token-panel__selected-name">
            {selected ? t('networks.tokensFor', { network: selected.name }) : ''}
          </p>

          <div key={selected?.id} className="token-chip-row token-chip-row--linked">
            {selected?.tokens.map((token) => (
              <span key={token} className="token-chip token-chip--active">
                {token}
              </span>
            ))}
          </div>

          <p className="network-token-panel__note">{t('networks.tokensNote')}</p>
        </div>
      </div>
    </RevealOnScroll>
  );
};

export default NetworkTokenPanel;
