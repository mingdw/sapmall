import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProposalStatus } from '../types/proposal.types';
import styles from './ProposalStatusTag.module.scss';

interface ProposalStatusTagProps {
  status: ProposalStatus;
}

const STATUS_CLASS: Record<ProposalStatus, string> = {
  draft: styles.draft,
  discussion: styles.discussion,
  active: styles.active,
  passed: styles.passed,
  rejected: styles.rejected,
  executed: styles.executed,
};

const ProposalStatusTag: React.FC<ProposalStatusTagProps> = ({ status }) => {
  const { t } = useTranslation();
  return (
    <span className={`${styles.tag} ${STATUS_CLASS[status]}`} aria-label={t(`dao.status.${status}`)}>
      {t(`dao.status.${status}`)}
    </span>
  );
};

export default ProposalStatusTag;
