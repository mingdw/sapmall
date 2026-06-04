import React from 'react';
import type { HelpCategoryFilter } from '../types';
import HelpFaqSection from './HelpFaqSection';
import HelpSupportSidebar from './HelpSupportSidebar';
import { HELP_LAYOUT } from '../constants/helpLayoutClasses';

type Props = {
  category: HelpCategoryFilter;
};

const HelpSidebar: React.FC<Props> = ({ category }) => {
  return (
    <aside className={HELP_LAYOUT.sidebarColumn}>
      <HelpFaqSection category={category} />
      <HelpSupportSidebar />
    </aside>
  );
};

export default HelpSidebar;
