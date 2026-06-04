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
import { helpFigureCanvasStyle } from '../constants/helpVisualStyles';

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
    <figure className="mb-5" data-category={category}>
      <div
        className="relative min-h-[11.5rem] overflow-hidden rounded-[0.85rem] border border-slate-900/10"
        style={helpFigureCanvasStyle(category)}
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-[0.35] bg-[length:24px_24px]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)',
          }}
        />
        <div className="pointer-events-none absolute -right-8 -top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22)_0%,transparent_70%)]" />
        <div className="absolute left-5 top-1/2 flex h-[4.5rem] w-[4.5rem] -translate-y-1/2 items-center justify-center rounded-2xl bg-white/90 text-[var(--help-primary)] shadow-[0_8px_24px_rgba(139,92,246,0.18)]">
          <meta.Icon size={42} strokeWidth={1.5} />
        </div>
        <div className="absolute right-[1.1rem] top-1/2 flex w-[min(58%,16rem)] -translate-y-1/2 flex-col gap-[0.45rem] rounded-[0.65rem] bg-white/90 px-4 py-[0.85rem] shadow-[0_6px_20px_rgba(15,23,42,0.08)]">
          <span className="block h-[0.45rem] w-[72%] rounded-full bg-gradient-to-r from-violet-500/35 to-amber-500/35" />
          <span className="block h-[0.45rem] w-[55%] rounded-full bg-gradient-to-r from-violet-500/35 to-amber-500/35" />
          <span className="block h-[0.45rem] w-[88%] rounded-full bg-gradient-to-r from-violet-500/35 to-amber-500/35" />
          <span className="mt-0.5 self-start rounded-full bg-violet-500/10 px-2 py-0.5 text-[0.6875rem] font-semibold text-violet-700">
            {localeLabel}
          </span>
        </div>
      </div>
      <figcaption className="mt-[0.45rem] text-center text-xs text-[var(--help-panel-muted)]">
        {t(captionKey)}
      </figcaption>
    </figure>
  );
};

export default HelpArticleFigure;
