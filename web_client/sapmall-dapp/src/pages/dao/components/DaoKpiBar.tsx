import React from 'react';
import {
  TeamOutlined,
  FileTextOutlined,
  RiseOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { DaoStats } from '../types/proposal.types';
import styles from './DaoKpiBar.module.scss';

interface DaoKpiBarProps {
  stats: DaoStats;
}

const DaoKpiBar: React.FC<DaoKpiBarProps> = ({ stats }) => {
  const { t } = useTranslation();
  const items = [
    { icon: TeamOutlined, label: t('dao.kpi.members'), value: stats.memberCount.toLocaleString() },
    { icon: FileTextOutlined, label: t('dao.kpi.active'), value: String(stats.activeProposals) },
    { icon: RiseOutlined, label: t('dao.kpi.participation'), value: `${stats.participationRate30d}%` },
    ...(stats.treasuryBalance
      ? [{ icon: BankOutlined, label: t('dao.kpi.treasury'), value: stats.treasuryBalance }]
      : []),
  ];

  return (
    <ul className={styles.bar}>
      {items.map((item) => (
        <li key={item.label} className={styles.item}>
          <span className={styles.iconWrap}>
            <item.icon className={styles.icon} aria-hidden />
          </span>
          <span className={styles.label}>{item.label}</span>
          <span className={styles.value}>{item.value}</span>
        </li>
      ))}
    </ul>
  );
};

export default DaoKpiBar;
