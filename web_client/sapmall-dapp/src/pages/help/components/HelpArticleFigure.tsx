import React from 'react';
import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CircleDollarSign,
  Shield,
  ShoppingBag,
  Store,
  Users,
  Wallet,
} from 'lucide-react';
import type { HelpCategory } from '../types';
import styles from './HelpArticleFigure.module.scss';

const FIGURE_META: Record<HelpCategory, { Icon: LucideIcon; labelZh: string; labelEn: string }> = {
  'getting-started': { Icon: Wallet, labelZh: '入门', labelEn: 'Start' },
  'wallet-security': { Icon: Shield, labelZh: '安全', labelEn: 'Security' },
  'exchange-payment': { Icon: CircleDollarSign, labelZh: '兑换', labelEn: 'Exchange' },
  marketplace: { Icon: ShoppingBag, labelZh: '商城', labelEn: 'Shop' },
  merchant: { Icon: Building2, labelZh: '商家', labelEn: 'Merchant' },
  'order-support': { Icon: Store, labelZh: '订单', labelEn: 'Orders' },
  'dao-community': { Icon: Users, labelZh: '社区', labelEn: 'DAO' },
};

type Props = {
  category: HelpCategory;
  captionKey: string;
};

const HelpArticleFigure: React.FC<Props> = ({ category, captionKey }) => {
  const { t, i18n } = useTranslation();
  const meta = FIGURE_META[category];
  const localeLabel = i18n.language.startsWith('zh') ? meta.labelZh : meta.labelEn;

  return (
    <figure className={styles.bodyFigure} data-category={category}>
      <div className={styles.bodyFigureCanvas} aria-hidden>
        <div className={styles.bodyFigureGrid} />
        <div className={styles.bodyFigureGlow} />
        <div className={styles.bodyFigureIconWrap}>
          <meta.Icon size={42} strokeWidth={1.5} />
        </div>
        <div className={styles.bodyFigureMock}>
          <span className={styles.bodyFigureMockBar} style={{ width: '72%' }} />
          <span className={styles.bodyFigureMockBar} style={{ width: '55%' }} />
          <span className={styles.bodyFigureMockBar} style={{ width: '88%' }} />
          <span className={styles.bodyFigureMockChip}>{localeLabel}</span>
        </div>
      </div>
      <figcaption className={styles.bodyFigureCaption}>{t(captionKey)}</figcaption>
    </figure>
  );
};

export default HelpArticleFigure;
