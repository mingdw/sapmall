import React, { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import HelpTopicBrowse from './components/HelpTopicBrowse';
import HelpTopicGuideList from './components/HelpTopicGuideList';
import HelpSidebar from './components/HelpSidebar';
import type { HelpOutletContext } from './helpOutletContext';
import styles from './HelpPage.module.scss';

const HelpPage: React.FC = () => {
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
    <div className={styles.contentZoneInner}>
      <div className={styles.mainListCard}>
        <div className={`${styles.panelCard} ${styles.panelCardAccent}`}>
                <div className={styles.helpTopicsPanel} ref={topicPanelRef}>
                  <div className={`${styles.panelSection} ${styles.panelSectionFilter}`}>
              <HelpTopicBrowse activeCategory={category} onTopicSelect={onTopicSelect} />
            </div>
            <div className={`${styles.panelSection} ${styles.panelSectionGuide}`}>
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

export default HelpPage;
