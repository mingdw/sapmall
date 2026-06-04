import React, { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import HelpTopicBrowse from './components/HelpTopicBrowse';
import HelpTopicGuideList from './components/HelpTopicGuideList';
import HelpSidebar from './components/HelpSidebar';
import type { HelpOutletContext } from './helpOutletContext';
import { HELP_LAYOUT } from './constants/helpLayoutClasses';
import pageStyles from './HelpHomePage.module.scss';
import sharedStyles from './styles/help.shared.module.scss';

const HelpHomePage: React.FC = () => {
  const { keyword, category, filteredArticles, onTopicSelect } =
    useOutletContext<HelpOutletContext>();
  const topicPanelRef = useRef<HTMLDivElement>(null);
  const prevCategoryRef = useRef(category);

  useEffect(() => {
    if (category === 'all' || category === prevCategoryRef.current) {
      prevCategoryRef.current = category;
      return;
    }
    prevCategoryRef.current = category;
    const timer = window.setTimeout(() => {
      topicPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [category]);

  return (
    <div className={HELP_LAYOUT.contentZoneInner}>
      <div className={HELP_LAYOUT.mainListCard}>
        <div className={sharedStyles.panelCard}>
          <div className={pageStyles.helpTopicsPanel} ref={topicPanelRef}>
            <div className={`${sharedStyles.panelSection} ${pageStyles.panelSectionFilter}`}>
              <HelpTopicBrowse activeCategory={category} onTopicSelect={onTopicSelect} />
            </div>
            <div className={`${sharedStyles.panelSection} ${pageStyles.panelSectionGuide}`}>
              <HelpTopicGuideList
                articles={filteredArticles}
                category={category}
                keyword={keyword}
              />
            </div>
          </div>
        </div>
      </div>

      <HelpSidebar category={category} />
    </div>
  );
};

export default HelpHomePage;
