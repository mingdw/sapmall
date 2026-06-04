import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDaoAnnouncements } from '../mocks/daoAnnouncements.mock';
import { daoEventPath } from '../utils/daoNavigation';

const tickerSlot =
  'pointer-events-none absolute left-0 right-0 z-[5] m-0 box-border px-5 lg:px-6 ' +
  'top-[calc(-1*var(--dao-content-overlap)-var(--dao-ticker-band-height)-var(--dao-ticker-gap)+var(--dao-ticker-offset-y))]';

const tickerWrap =
  'pointer-events-auto mx-auto w-[min(100%,var(--dao-content-max-width))] max-w-[var(--dao-content-max-width)] overflow-hidden ' +
  'lg:ml-[max(0px,calc((100%-var(--dao-content-align-width))/2))] lg:mr-auto';

const DaoAnnouncementTicker: React.FC = () => {
  const { t } = useTranslation();
  const announcements = useMemo(() => getDaoAnnouncements(), []);

  if (announcements.length === 0) {
    return null;
  }

  const loopItems = [...announcements, ...announcements];

  return (
    <div className={tickerSlot}>
      <div className={tickerWrap} aria-label={t('dao.announcementTicker.aria')}>
        <div className="inline-flex min-w-max items-center gap-8 py-[0.35rem] animate-dao-announcement-scroll hover:[animation-play-state:paused] motion-reduce:flex-wrap motion-reduce:min-w-0 motion-reduce:animate-none">
          {loopItems.map((item, idx) => {
            const title = t(`dao.announcementTicker.titles.${item.id}`);
            return (
              <Link
                key={`${item.id}-${idx}`}
                to={daoEventPath(item.id)}
                className="inline-flex items-center gap-[0.45rem] border-none bg-transparent p-0 no-underline transition-opacity hover:opacity-90 hover:[&_.ticker-text]:text-slate-200"
                aria-label={t('dao.announcementTicker.linkAria', { title })}
              >
                <Megaphone className="shrink-0 text-red-500" size={14} strokeWidth={2.25} aria-hidden />
                <span className="ticker-text whitespace-nowrap text-[0.8125rem] font-medium tracking-wide text-slate-400 transition-colors">
                  {title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DaoAnnouncementTicker;
