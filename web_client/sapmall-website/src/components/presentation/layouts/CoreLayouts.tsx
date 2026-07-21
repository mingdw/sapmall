import React from 'react';
import { useTranslation } from 'react-i18next';
import TravelersArt from '../art/TravelersArt';

type Props = { slideId: string; art?: 'travelers' | 'travelersCity'; compact?: boolean };

export const CoverLayout: React.FC<Props> = ({ slideId, art = 'travelersCity', compact }) => {
  const { t } = useTranslation();
  const base = `presentation.slides.${slideId}`;
  return (
    <div className={`ppt-layout ppt-layout--cover ${compact ? 'is-compact' : ''}`}>
      <div className="ppt-cover__copy">
        <h1 className="ppt-cover__title">{t(`${base}.title`)}</h1>
        <p className="ppt-cover__subtitle">{t(`${base}.subtitle`)}</p>
        <p className="ppt-cover__footer">{t(`${base}.footer`)}</p>
      </div>
      <TravelersArt variant={art === 'travelersCity' ? 'city' : 'plain'} className="ppt-cover__art" />
    </div>
  );
};

export const TocLayout: React.FC<{ slideId: string; compact?: boolean }> = ({ slideId, compact }) => {
  const { t } = useTranslation();
  const base = `presentation.slides.${slideId}`;
  const items = t(`${base}.items`, { returnObjects: true }) as string[];
  const list = Array.isArray(items) ? items : [];
  const row1 = list.slice(0, 4);
  const row2 = list.slice(4);

  return (
    <div className={`ppt-layout ppt-layout--toc ${compact ? 'is-compact' : ''}`}>
      <div className="ppt-toc__wash ppt-toc__wash--tl" />
      <div className="ppt-toc__wash ppt-toc__wash--tr" />
      <div className="ppt-toc__wash ppt-toc__wash--bl" />
      <div className="ppt-toc__wash ppt-toc__wash--bc" />
      <h1 className="ppt-toc__title">{t(`${base}.title`)}</h1>
      <div className="ppt-toc__rows">
        <div className="ppt-toc__row">
          {row1.map((label, i) => (
            <div key={label} className="ppt-toc__item">
              <span className="ppt-toc__num">{String(i + 1).padStart(2, '0')}.</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="ppt-toc__row ppt-toc__row--center">
          {row2.map((label, i) => (
            <div key={label} className="ppt-toc__item">
              <span className="ppt-toc__num">{String(i + 5).padStart(2, '0')}.</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

type SplitProps = {
  slideId: string;
  art: 'travelers' | 'travelersCity';
  bulletStyle?: 'plain' | 'labeled';
  compact?: boolean;
};

export const SplitBulletsLayout: React.FC<SplitProps> = ({
  slideId,
  art,
  bulletStyle = 'plain',
  compact,
}) => {
  const { t } = useTranslation();
  const base = `presentation.slides.${slideId}`;
  const intro = t(`${base}.intro`, { defaultValue: '' });
  const bullets = t(`${base}.bullets`, { returnObjects: true }) as
    | string[]
    | { title: string; desc: string }[];
  const list = Array.isArray(bullets) ? bullets : [];

  return (
    <div className={`ppt-layout ppt-layout--split ${compact ? 'is-compact' : ''}`}>
      <TravelersArt variant={art === 'travelersCity' ? 'city' : 'plain'} className="ppt-split__art" />
      <div className="ppt-split__copy">
        <h2 className="ppt-slide-title">{t(`${base}.title`)}</h2>
        {intro ? <p className="ppt-split__intro">{intro}</p> : null}
        <ul className={`ppt-split__list ${bulletStyle === 'labeled' ? 'ppt-split__list--labeled' : ''}`}>
          {list.map((item, i) => {
            if (typeof item === 'string') {
              return <li key={`${i}-${item}`}>{item}</li>;
            }
            return (
              <li key={`${i}-${item.title}`}>
                <strong>{item.title}</strong>
                <span> — {item.desc}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export const NumberedRowsLayout: React.FC<{ slideId: string; compact?: boolean }> = ({
  slideId,
  compact,
}) => {
  const { t } = useTranslation();
  const base = `presentation.slides.${slideId}`;
  const rows = t(`${base}.rows`, { returnObjects: true }) as { title: string; desc: string }[];
  const list = Array.isArray(rows) ? rows : [];

  return (
    <div className={`ppt-layout ppt-layout--rows ${compact ? 'is-compact' : ''}`}>
      <h2 className="ppt-slide-title">{t(`${base}.title`)}</h2>
      <p className="ppt-slide-subtitle">{t(`${base}.subtitle`)}</p>
      <div className="ppt-rows">
        {list.map((row, i) => (
          <div key={row.title} className="ppt-rows__item">
            <div className={`ppt-rows__badge ${i % 2 === 0 ? 'is-purple' : 'is-blue'}`}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="ppt-rows__body">
              <strong>{row.title}</strong>
              <span>{row.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Grid2x2Layout: React.FC<{ slideId: string; compact?: boolean }> = ({ slideId, compact }) => {
  const { t } = useTranslation();
  const base = `presentation.slides.${slideId}`;
  const cells = t(`${base}.cells`, { returnObjects: true }) as { title: string; desc: string }[];
  const list = Array.isArray(cells) ? cells : [];

  return (
    <div className={`ppt-layout ppt-layout--grid2 ${compact ? 'is-compact' : ''}`}>
      <h2 className="ppt-slide-title">{t(`${base}.title`)}</h2>
      <p className="ppt-slide-subtitle">{t(`${base}.subtitle`)}</p>
      <div className="ppt-grid2">
        {list.map((cell, i) => (
          <div key={cell.title} className="ppt-grid2__cell">
            <div className="ppt-grid2__num">{i + 1}</div>
            <div>
              <h3>{cell.title}</h3>
              <p>{cell.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Columns3CircleLayout: React.FC<{ slideId: string; compact?: boolean }> = ({
  slideId,
  compact,
}) => {
  const { t } = useTranslation();
  const base = `presentation.slides.${slideId}`;
  const cols = t(`${base}.cols`, { returnObjects: true }) as { title: string; desc: string }[];
  const list = Array.isArray(cols) ? cols : [];

  return (
    <div className={`ppt-layout ppt-layout--cols3 ${compact ? 'is-compact' : ''}`}>
      <h2 className="ppt-slide-title">{t(`${base}.title`)}</h2>
      <p className="ppt-slide-subtitle">{t(`${base}.subtitle`)}</p>
      <div className="ppt-cols3">
        {list.map((col, i) => (
          <div key={col.title} className="ppt-cols3__item">
            <div className="ppt-cols3__badge">{String(i + 1).padStart(2, '0')}</div>
            <h3>{col.title}</h3>
            <p>{col.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AltCards4Layout: React.FC<{ slideId: string; compact?: boolean }> = ({
  slideId,
  compact,
}) => {
  const { t } = useTranslation();
  const base = `presentation.slides.${slideId}`;
  const cards = t(`${base}.cards`, { returnObjects: true }) as { title: string; desc: string }[];
  const list = Array.isArray(cards) ? cards : [];

  return (
    <div className={`ppt-layout ppt-layout--alt4 ${compact ? 'is-compact' : ''}`}>
      <h2 className="ppt-slide-title">{t(`${base}.title`)}</h2>
      <p className="ppt-slide-subtitle">{t(`${base}.subtitle`)}</p>
      <div className="ppt-alt4">
        {list.map((card, i) => (
          <article key={card.title} className={`ppt-alt4__card ${i % 2 === 1 ? 'is-dark' : 'is-light'}`}>
            <div className="ppt-alt4__num">{String(i + 1).padStart(2, '0')}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
};
