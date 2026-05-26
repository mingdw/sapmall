import React from 'react';
import type { HelpCategoryFilter } from '../types';
import HelpFaqSection from './HelpFaqSection';
import HelpSupportSidebar from './HelpSupportSidebar';
import layoutStyles from '../styles/help.pageLayout.module.scss';

type Props = {
  category: HelpCategoryFilter;
};

const HelpSidebar: React.FC<Props> = ({ category }) => {
  return (
    <aside className={layoutStyles.sidebarColumn}>
      <HelpFaqSection category={category} variant="sidebar" />
      <HelpSupportSidebar />
    </aside>
  );
};

export default HelpSidebar;
