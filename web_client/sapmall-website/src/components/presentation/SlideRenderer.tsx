import React from 'react';
import type { SlideDef } from '../../content/presentationSlides';
import {
  AltCards4Layout,
  Columns3CircleLayout,
  CoverLayout,
  Grid2x2Layout,
  NumberedRowsLayout,
  SplitBulletsLayout,
  TocLayout,
} from './layouts/CoreLayouts';
import BadgeCardsLayout from './layouts/BadgeCardsLayout';

type SlideRendererProps = {
  slide: SlideDef;
  compact?: boolean;
};

const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, compact = false }) => {
  switch (slide.kind) {
    case 'cover':
      return <CoverLayout slideId={slide.id} art={slide.art} compact={compact} />;
    case 'toc':
      return <TocLayout slideId={slide.id} compact={compact} />;
    case 'splitBullets':
      return (
        <SplitBulletsLayout
          slideId={slide.id}
          art={slide.art}
          bulletStyle={slide.bulletStyle}
          compact={compact}
        />
      );
    case 'numberedRows':
      return <NumberedRowsLayout slideId={slide.id} compact={compact} />;
    case 'grid2x2':
      return <Grid2x2Layout slideId={slide.id} compact={compact} />;
    case 'columns3Circle':
      return <Columns3CircleLayout slideId={slide.id} compact={compact} />;
    case 'altCards4':
      return <AltCards4Layout slideId={slide.id} compact={compact} />;
    case 'badgeCards':
      return (
        <BadgeCardsLayout
          slideId={slide.id}
          cols={slide.cols}
          badge={slide.badge}
          cardTone={slide.cardTone}
          badgePosition={slide.badgePosition}
          wrapSecondRow={slide.wrapSecondRow}
          highlightIndex={slide.highlightIndex}
          compact={compact}
        />
      );
    default:
      return null;
  }
};

export default SlideRenderer;
