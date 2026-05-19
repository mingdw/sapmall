import React from 'react';
import { LinkOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ExecutionInfo } from '../types/proposal.types';
import SectionTitle from './SectionTitle';
import shared from '../styles/dao.shared.module.scss';
import styles from './ExecutionStatus.module.scss';

interface ExecutionStatusProps {
  execution?: ExecutionInfo;
}

const ExecutionStatus: React.FC<ExecutionStatusProps> = ({ execution }) => {
  const { t } = useTranslation();
  if (!execution) return null;

  const statusLabel = t(`dao.execution.${execution.status}`);

  return (
    <section className={`${shared.panel} ${styles.wrap}`}>
      <SectionTitle title={t('dao.detail.execution')} />
      <ul className={styles.list}>
        <li>
          <CheckCircleOutlined className={styles.icon} aria-hidden />
          <span className={styles.label}>{t('dao.execution.statusLabel')}</span>
          <span className={styles.value}>{statusLabel}</span>
        </li>
        {execution.timelockEndsAt && (
          <li>
            <ClockCircleOutlined className={styles.icon} aria-hidden />
            <span className={styles.label}>{t('dao.execution.timelockEnds')}</span>
            <time className={styles.value} dateTime={execution.timelockEndsAt}>
              {new Date(execution.timelockEndsAt).toLocaleString()}
            </time>
          </li>
        )}
        {execution.txHash && (
          <li>
            <LinkOutlined className={styles.icon} aria-hidden />
            <span className={styles.label}>{t('dao.execution.tx')}</span>
            <a
              href={`https://etherscan.io/tx/${execution.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {execution.txHash.slice(0, 10)}…
            </a>
          </li>
        )}
      </ul>
    </section>
  );
};

export default ExecutionStatus;
