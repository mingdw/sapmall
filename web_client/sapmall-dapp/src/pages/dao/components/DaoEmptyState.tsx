import React from 'react';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './DaoEmptyState.module.scss';

interface DaoEmptyStateProps {
  type: 'proposals' | 'wallet' | 'power' | 'detail' | 'comments';
}

const DaoEmptyState: React.FC<DaoEmptyStateProps> = ({ type }) => {
  const { t } = useTranslation();
  return (
    <Empty
      className={styles.empty}
      description={
        <span className={styles.desc}>{t(`dao.empty.${type}`)}</span>
      }
    />
  );
};

export default DaoEmptyState;
