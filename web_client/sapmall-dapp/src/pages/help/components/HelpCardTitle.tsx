import React from 'react';
import sharedStyles from '../styles/help.shared.module.scss';

type Props = {
  id?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

/** 帮助中心卡片区统一标题：图标 + 文案 */
const HelpCardTitle: React.FC<Props> = ({ id, icon, children }) => {
  return (
    <h2 id={id} className={sharedStyles.cardSectionTitle}>
      <span className={sharedStyles.cardSectionTitleIcon} aria-hidden>
        {icon}
      </span>
      <span className={sharedStyles.cardSectionTitleText}>{children}</span>
    </h2>
  );
};

export default HelpCardTitle;
