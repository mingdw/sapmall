import React from 'react';
import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import {
  CalendarClock,
  FilePenLine,
  PieChart,
  Scale,
  ShieldCheck,
  Vote,
} from 'lucide-react';
import { DAO_PROPOSAL_RULE_ICON_WRAP } from '../constants/daoProposalRuleIconClasses';
import { DAO_PROPOSAL_RULES } from '../mocks/daoProposalRules.mock';
import type { DaoProposalRuleIcon } from '../mocks/daoProposalRules.mock';
import sharedStyles from '../styles/dao.shared.module.scss';

const ruleIconMap: Record<DaoProposalRuleIcon, LucideIcon> = {
  submit: FilePenLine,
  window: CalendarClock,
  quorum: PieChart,
  vote: Vote,
  execute: ShieldCheck,
};

const DaoProposalRulesCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <aside
      className={`${sharedStyles.panelCard} ${sharedStyles.sidebarCard} border-t-[3px] border-t-[var(--dao-tab-proposals)] px-[1.35rem] py-5`}
      aria-labelledby="dao-proposal-rules-title"
    >
      <h2
        id="dao-proposal-rules-title"
        className="m-0 mb-2 flex items-center gap-2 text-[0.9375rem] font-semibold leading-snug text-[var(--dao-panel-text)]"
      >
        <Scale className="h-[1.125rem] w-[1.125rem] shrink-0 text-[var(--dao-tab-proposals)]" strokeWidth={2.25} aria-hidden />
        <span>{t('dao.proposalRules.title')}</span>
      </h2>
      <p className="m-0 mb-4 text-[0.8125rem] leading-relaxed text-[var(--dao-panel-muted)]">
        {t('dao.proposalRules.intro')}
      </p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {DAO_PROPOSAL_RULES.map((rule) => {
          const Icon = ruleIconMap[rule.icon];
          const iconWrap = DAO_PROPOSAL_RULE_ICON_WRAP[rule.id] ?? 'bg-slate-100 text-slate-600';
          return (
            <li key={rule.id} className="flex items-start gap-[0.65rem]">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconWrap}`}
                data-rule={rule.id}
                aria-hidden
              >
                <Icon className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-[0.2rem] text-[0.8125rem] font-semibold leading-snug text-[var(--dao-panel-text)]">
                  {t(rule.titleKey)}
                </h3>
                <p className="m-0 text-xs leading-normal text-[var(--dao-panel-muted)]">{t(rule.descKey)}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="m-0 mt-4 border-t border-[#eef1f5] pt-3 text-[0.6875rem] leading-snug text-slate-400">
        {t('dao.proposalRules.footnote')}
      </p>
    </aside>
  );
};

export default DaoProposalRulesCard;
