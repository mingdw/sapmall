import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './RewardsPageDetail.module.scss';

const RewardsLayout: React.FC = () => (
  <div className={styles.pageRoot}>
    <div className={styles.pageShell}>
      <Outlet />
    </div>
  </div>
);

export default RewardsLayout;
