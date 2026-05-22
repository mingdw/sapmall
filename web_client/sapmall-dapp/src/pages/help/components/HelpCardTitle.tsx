import React from 'react';
import styles from '../HelpPage.module.scss';

type Props = {
  id?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

/** 帮助中心卡片区统一标题：图标 + 文案 */
const HelpCardTitle: React.FC<Props> = ({ id, icon, children }) => {
  return (
    <h2 id={id} className={styles.cardSectionTitle}>
      <span className={styles.cardSectionTitleIcon} aria-hidden>
        {icon}
      </span>
      <span className={styles.cardSectionTitleText}>{children}</span>
    </h2>
  );
};

export default HelpCardTitle;
