import type { HelpArticleBlock, HelpCategory } from '../types';

const LAYOUT_VARIANT_COUNT = 6;

export const getArticleLayoutVariant = (index: number): number => index % LAYOUT_VARIANT_COUNT;

type BlockKey = 'intro' | 'stepsTitle' | 'steps' | 'tip' | 'detailHeading' | 'detail' | 'figureCaption';

/**
 * 按文章序号轮换 6 种正文结构，避免千篇一律
 */
export const buildTopicQaArticleBlocks = (
  slug: string,
  category: HelpCategory,
  index: number,
): HelpArticleBlock[] => {
  const k = (part: BlockKey) => `help.topicQa.${slug}.${part}`;
  const variant = getArticleLayoutVariant(index);
  const h2 = (part: 'stepsTitle' | 'detailHeading') => ({
    type: 'heading' as const,
    level: 2 as const,
    key: k(part),
  });
  const figure = {
    type: 'figure' as const,
    category,
    captionKey: k('figureCaption'),
  };
  const steps = { type: 'steps' as const, key: k('steps') };
  const callout = (variant: 'tip' | 'warning') => ({
    type: 'callout' as const,
    variant,
    key: k('tip'),
  });

  switch (variant) {
    case 0:
      return [
        { type: 'paragraph', key: k('intro') },
        figure,
        h2('stepsTitle'),
        steps,
        callout('tip'),
        h2('detailHeading'),
        { type: 'paragraph', key: k('detail') },
      ];
    case 1:
      return [
        { type: 'paragraph', key: k('intro') },
        h2('stepsTitle'),
        steps,
        figure,
        callout('warning'),
        { type: 'paragraph', key: k('detail') },
      ];
    case 2:
      return [
        { type: 'paragraph', key: k('intro') },
        h2('detailHeading'),
        { type: 'paragraph', key: k('detail') },
        callout('tip'),
        h2('stepsTitle'),
        steps,
      ];
    case 3:
      return [
        { type: 'paragraph', key: k('intro') },
        figure,
        { type: 'paragraph', key: k('detail') },
        callout('tip'),
        steps,
      ];
    case 4:
      return [
        { type: 'paragraph', key: k('intro') },
        callout('warning'),
        steps,
        figure,
        { type: 'paragraph', key: k('detail') },
      ];
    case 5:
    default:
      return [
        { type: 'paragraph', key: k('intro') },
        callout('tip'),
        h2('stepsTitle'),
        steps,
        figure,
        h2('detailHeading'),
        { type: 'paragraph', key: k('detail') },
      ];
  }
};
