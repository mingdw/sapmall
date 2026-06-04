import React from 'react';
import { Outlet } from 'react-router-dom';
import DaoHeroSection from './components/DaoHeroSection';
import DaoAnnouncementTicker from './components/DaoAnnouncementTicker';
import layoutStyles from './DaoLayout.module.scss';

const DaoLayout: React.FC = () => (
  <div className={layoutStyles.pageRoot}>
    <div className={layoutStyles.pageShell}>
      <DaoHeroSection />
      <section className={layoutStyles.contentZone} aria-label="DAO content">
        <DaoAnnouncementTicker />
        <div className={layoutStyles.contentZoneBody}>
          <Outlet />
        </div>
      </section>
    </div>
  </div>
);

export default DaoLayout;




