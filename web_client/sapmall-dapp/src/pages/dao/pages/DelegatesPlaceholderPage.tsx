import React from 'react';
import { Link } from 'react-router-dom';
import { TeamOutlined, RocketOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import shared from '../styles/dao.shared.module.scss';
import styles from './DelegatesPlaceholderPage.module.scss';

const DelegatesPlaceholderPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main className={shared.page}>
      <section className={`${shared.panel} ${styles.card}`}>
        <span className={styles.iconRing}>
          <TeamOutlined className={styles.icon} aria-hidden />
        </span>
        <span className={shared.badge}>
          <RocketOutlined style={{ fontSize: 12 }} aria-hidden />
          {t('dao.delegates.badge')}
        </span>
        <h1 className={shared.pageTitle}>{t('dao.delegates.title')}</h1>
        <p className={shared.pageSubtitle}>{t('dao.delegates.subtitle')}</p>
        <p className={shared.bodyText}>{t('dao.delegates.comingSoon')}</p>
        <Link to="/dao" className={shared.ctaGhost}>
          {t('dao.detail.backToList')}
        </Link>
      </section>
    </main>
  );
};

export default DelegatesPlaceholderPage;
