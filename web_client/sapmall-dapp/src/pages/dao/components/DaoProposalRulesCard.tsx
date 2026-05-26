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
import { DAO_PROPOSAL_RULES } from '../mocks/daoProposalRules.mock';
import type { DaoProposalRuleIcon } from '../mocks/daoProposalRules.mock';
import sharedStyles from '../styles/dao.shared.module.scss';
import styles from './DaoProposalRulesCard.module.scss';

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
      className={`${sharedStyles.panelCard} ${sharedStyles.sidebarCard} ${styles.proposalRulesCard}`}
      aria-labelledby="dao-proposal-rules-title"
    >
      <h2 id="dao-proposal-rules-title" className={styles.proposalRulesTitle}>
        <Scale className={styles.proposalRulesTitleIcon} strokeWidth={2.25} aria-hidden />
        <span>{t('dao.proposalRules.title')}</span>
      </h2>
      <p className={styles.proposalRulesIntro}>{t('dao.proposalRules.intro')}</p>
      <ul className={styles.proposalRulesList}>
        {DAO_PROPOSAL_RULES.map((rule) => {
          const Icon = ruleIconMap[rule.icon];
          return (
            <li key={rule.id} className={styles.proposalRulesItem}>
              <span className={styles.proposalRulesIconWrap} data-rule={rule.id} aria-hidden>
                <Icon className={styles.proposalRulesIcon} strokeWidth={2.25} />
              </span>
              <div className={styles.proposalRulesCopy}>
                <h3 className={styles.proposalRulesItemTitle}>{t(rule.titleKey)}</h3>
                <p className={styles.proposalRulesItemDesc}>{t(rule.descKey)}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className={styles.proposalRulesFootnote}>{t('dao.proposalRules.footnote')}</p>
    </aside>
  );
};

export default DaoProposalRulesCard;



