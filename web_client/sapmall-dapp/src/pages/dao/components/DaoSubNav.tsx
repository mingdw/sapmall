import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './DaoSubNav.module.scss';

const DaoSubNav: React.FC = () => {
  const { t } = useTranslation();

  const links = [
    { to: '/dao', end: true, icon: HomeOutlined, label: t('dao.nav.home') },
    { to: '/dao/proposals', icon: UnorderedListOutlined, label: t('dao.nav.proposals') },
    { to: '/dao/new', icon: PlusCircleOutlined, label: t('dao.nav.new') },
    { to: '/dao/delegates', icon: TeamOutlined, label: t('dao.nav.delegates') },
  ];

  return (
    <nav className={styles.nav} aria-label={t('dao.nav.aria')}>
      {links.map(({ to, end, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ''}`
          }
        >
          <Icon className={styles.linkIcon} aria-hidden />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default DaoSubNav;
