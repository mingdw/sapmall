import React from 'react';
import type { HelpCategoryFilter } from '../types';
import HelpFaqSection from './HelpFaqSection';
import HelpSupportSidebar from './HelpSupportSidebar';
import styles from '../HelpPage.module.scss';

type Props = {
  category: HelpCategoryFilter;
};

const HelpSidebar: React.FC<Props> = ({ category }) => {
  return (
    <aside className={styles.sidebarColumn}>
      <HelpFaqSection category={category} variant="sidebar" />
      <HelpSupportSidebar />
    </aside>
  );
};

export default HelpSidebar;
