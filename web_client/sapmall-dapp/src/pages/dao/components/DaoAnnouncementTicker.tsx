import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDaoAnnouncements } from '../mocks/daoAnnouncements.mock';
import { daoEventPath } from '../utils/daoNavigation';
import styles from '../DaoPage.module.scss';

const DaoAnnouncementTicker: React.FC = () => {
  const { t } = useTranslation();
  const announcements = useMemo(() => getDaoAnnouncements(), []);

  if (announcements.length === 0) {
    return null;
  }

  const loopItems = [...announcements, ...announcements];

  return (
    <div className={styles.announcementTickerSlot}>
      <div className={styles.announcementTickerWrap} aria-label={t('dao.announcementTicker.aria')}>
        <div className={styles.announcementTickerTrack}>
          {loopItems.map((item, idx) => {
            const title = t(`dao.announcementTicker.titles.${item.id}`);
            return (
              <Link
                key={`${item.id}-${idx}`}
                to={daoEventPath(item.id)}
                className={styles.announcementTickerItem}
                aria-label={t('dao.announcementTicker.linkAria', { title })}
              >
                <Megaphone className={styles.announcementTickerIcon} size={14} strokeWidth={2.25} aria-hidden />
                <span className={styles.announcementTickerText}>{title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DaoAnnouncementTicker;
