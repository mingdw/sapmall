/** 平台介绍幻灯片结构定义（文案走 i18n presentation.slides.*） */

export type SlideArt = 'travelers' | 'travelersCity';

export type BadgeShape = 'circle' | 'square' | 'arrow' | 'oval' | 'pill';
export type CardTone = 'flat' | 'filled' | 'alt' | 'blueFilled' | 'lavender';
export type BadgePosition = 'top' | 'topOverlap' | 'topLeft' | 'bottom';

export type SlideDef =
  | { id: string; kind: 'cover'; art?: SlideArt }
  | { id: string; kind: 'toc' }
  | {
      id: string;
      kind: 'splitBullets';
      art: SlideArt;
      /** bullets 为 title+desc 时用 labeled */
      bulletStyle?: 'plain' | 'labeled';
    }
  | { id: string; kind: 'numberedRows' }
  | { id: string; kind: 'grid2x2' }
  | { id: string; kind: 'columns3Circle' }
  | { id: string; kind: 'altCards4' }
  | {
      id: string;
      kind: 'badgeCards';
      cols: 3 | 4 | 5;
      badge: BadgeShape;
      cardTone: CardTone;
      badgePosition?: BadgePosition;
      /** 5 列时第二行居中两卡 */
      wrapSecondRow?: boolean;
      highlightIndex?: number;
    };

/** 按 PPT 顺序 */
export const presentationSlides: SlideDef[] = [
  { id: 'cover', kind: 'cover', art: 'travelersCity' },
  { id: 'toc', kind: 'toc' },
  { id: 'intro', kind: 'splitBullets', art: 'travelers', bulletStyle: 'labeled' },
  { id: 'overview', kind: 'numberedRows' },
  { id: 'architecture', kind: 'numberedRows' },
  { id: 'painpoints', kind: 'splitBullets', art: 'travelers', bulletStyle: 'plain' },
  { id: 'web2limits', kind: 'grid2x2' },
  { id: 'merchant', kind: 'columns3Circle' },
  { id: 'decentral', kind: 'splitBullets', art: 'travelers', bulletStyle: 'plain' },
  { id: 'settlement', kind: 'altCards4' },
  {
    id: 'global',
    kind: 'badgeCards',
    cols: 3,
    badge: 'circle',
    cardTone: 'flat',
    badgePosition: 'top',
    highlightIndex: 1,
  },
  {
    id: 'community',
    kind: 'badgeCards',
    cols: 4,
    badge: 'circle',
    cardTone: 'lavender',
    badgePosition: 'topOverlap',
  },
  { id: 'roles', kind: 'splitBullets', art: 'travelers', bulletStyle: 'labeled' },
  { id: 'rolesDetail', kind: 'splitBullets', art: 'travelers', bulletStyle: 'labeled' },
  {
    id: 'fourRoles',
    kind: 'badgeCards',
    cols: 4,
    badge: 'circle',
    cardTone: 'blueFilled',
    badgePosition: 'topOverlap',
  },
  {
    id: 'roleIncentives',
    kind: 'badgeCards',
    cols: 4,
    badge: 'square',
    cardTone: 'flat',
    badgePosition: 'top',
  },
  { id: 'featuresEntry', kind: 'splitBullets', art: 'travelers', bulletStyle: 'plain' },
  {
    id: 'dappFeatures',
    kind: 'badgeCards',
    cols: 5,
    badge: 'square',
    cardTone: 'flat',
    badgePosition: 'topLeft',
    wrapSecondRow: true,
  },
  {
    id: 'websiteOverview',
    kind: 'badgeCards',
    cols: 4,
    badge: 'arrow',
    cardTone: 'flat',
    badgePosition: 'top',
  },
  {
    id: 'adminModules',
    kind: 'badgeCards',
    cols: 4,
    badge: 'oval',
    cardTone: 'flat',
    badgePosition: 'top',
  },
  { id: 'roadmap', kind: 'splitBullets', art: 'travelers', bulletStyle: 'plain' },
  {
    id: 'paymentPlan',
    kind: 'badgeCards',
    cols: 3,
    badge: 'pill',
    cardTone: 'filled',
    badgePosition: 'bottom',
  },
  { id: 'thanks', kind: 'cover', art: 'travelersCity' },
];

export function getPresentationSlides(): SlideDef[] {
  return presentationSlides;
}

export function getSlideTitleKey(id: string): string {
  return `presentation.slides.${id}.navTitle`;
}
