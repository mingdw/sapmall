import React from 'react';
import { Outlet } from 'react-router-dom';
import DaoHeroSection from './components/DaoHeroSection';
import DaoAnnouncementTicker from './components/DaoAnnouncementTicker';
import styles from './DaoPage.module.scss';

const DaoLayout: React.FC = () => (
  <div className={styles.pageRoot}>
    <div className={styles.pageShell}>
      <DaoHeroSection />
      <section className={styles.contentZone} aria-label="DAO content">
        <DaoAnnouncementTicker />
        <div className={styles.contentZoneBody}>
          <Outlet />
        </div>
      </section>
    </div>
  </div>
);

export default DaoLayout;




