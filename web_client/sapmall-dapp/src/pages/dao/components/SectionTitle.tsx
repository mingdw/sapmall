import React from 'react';
import styles from '../styles/dao.shared.module.scss';

interface SectionTitleProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, action, className }) => (
  <header className={`${styles.sectionHead} ${className ?? ''}`}>
    <span className={styles.sectionHeadStart}>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </span>
    {action}
  </header>
);

export default SectionTitle;
