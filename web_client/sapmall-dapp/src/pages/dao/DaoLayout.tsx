import React from 'react';
import DaoSubNav from './components/DaoSubNav';
import styles from './DaoLayout.module.scss';

const DaoLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className={styles.shell}>
    <span className={styles.ambientTop} aria-hidden />
    <span className={styles.ambientSide} aria-hidden />
    <span className={styles.gridOverlay} aria-hidden />
    <section className={styles.inner}>
      <DaoSubNav />
      {children}
    </section>
  </section>
);

export default DaoLayout;
