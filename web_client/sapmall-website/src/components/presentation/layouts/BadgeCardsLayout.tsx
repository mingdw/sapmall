import React from 'react';
import { useTranslation } from 'react-i18next';
import type { BadgePosition, BadgeShape, CardTone } from '../../../content/presentationSlides';

type BadgeCardsProps = {
  slideId: string;
  cols: 3 | 4 | 5;
  badge: BadgeShape;
  cardTone: CardTone;
  badgePosition?: BadgePosition;
  wrapSecondRow?: boolean;
  highlightIndex?: number;
  compact?: boolean;
};

function padNum(i: number, badge: BadgeShape) {
  const n = i + 1;
  if (badge === 'square' && n < 10) return String(n);
  return String(n).padStart(2, '0');
}

const BadgeCardsLayout: React.FC<BadgeCardsProps> = ({
  slideId,
  cols,
  badge,
  cardTone,
  badgePosition = 'top',
  wrapSecondRow = false,
  highlightIndex,
  compact,
}) => {
  const { t } = useTranslation();
  const base = `presentation.slides.${slideId}`;
  const cards = t(`${base}.cards`, { returnObjects: true }) as { title: string; desc: string }[];
  const list = Array.isArray(cards) ? cards : [];
  const inShell = cardTone === 'flat' && badge === 'square' && badgePosition === 'top' && cols === 4;

  const renderCard = (card: { title: string; desc: string }, i: number) => {
    const highlighted = highlightIndex === i;
    return (
      <article
        key={`${card.title}-${i}`}
        className={[
          'ppt-bc__card',
          `ppt-bc__card--${cardTone}`,
          `ppt-bc__card--badge-${badgePosition}`,
          highlighted ? 'is-highlight' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={`ppt-bc__badge ppt-bc__badge--${badge} ${highlighted ? 'is-highlight' : ''}`}>
          {padNum(i, badge)}
        </div>
        <h3>{card.title}</h3>
        <p>{card.desc}</p>
      </article>
    );
  };

  const firstRow = wrapSecondRow ? list.slice(0, 3) : list;
  const secondRow = wrapSecondRow ? list.slice(3) : [];

  return (
    <div
      className={`ppt-layout ppt-layout--badge-cards ppt-bc cols-${cols} ${compact ? 'is-compact' : ''}`}
    >
      <h2 className="ppt-slide-title">{t(`${base}.title`)}</h2>
      <p className="ppt-slide-subtitle">{t(`${base}.subtitle`)}</p>
      {inShell ? (
        <div className="ppt-bc__shell">{list.map(renderCard)}</div>
      ) : wrapSecondRow ? (
        <div className="ppt-bc__wrap">
          <div className="ppt-bc__grid ppt-bc__grid--3">{firstRow.map(renderCard)}</div>
          <div className="ppt-bc__grid ppt-bc__grid--2center">{secondRow.map((c, i) => renderCard(c, i + 3))}</div>
        </div>
      ) : (
        <div className={`ppt-bc__grid ppt-bc__grid--${cols}`}>{list.map(renderCard)}</div>
      )}
    </div>
  );
};

export default BadgeCardsLayout;
