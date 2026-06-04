import type { CSSProperties } from 'react';
import type { HelpCategory } from '../types';

/** Hero 背景遮罩（多层渐变，Tailwind arbitrary 过长故集中维护） */
export const HELP_HERO_SCRIM_STYLE: CSSProperties = {
  background: [
    'linear-gradient(105deg, rgba(15, 23, 42, 0.97) 0%, rgba(15, 23, 42, 0.88) 38%, rgba(15, 23, 42, 0.72) 68%, rgba(49, 46, 129, 0.45) 100%)',
    'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, transparent 48%)',
    'radial-gradient(ellipse 80% 55% at 85% 10%, rgba(139, 92, 246, 0.14) 0%, transparent 55%)',
    'radial-gradient(ellipse 60% 40% at 10% 90%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
  ].join(', '),
};

const FIGURE_CANVAS_DEFAULT =
  'linear-gradient(145deg, #f8fafc 0%, #eef2ff 48%, #fff7ed 100%)';

export const HELP_FIGURE_CANVAS_BY_CATEGORY: Partial<Record<HelpCategory, string>> = {
  'wallet-security': 'linear-gradient(145deg, #f0fdf4 0%, #ecfdf5 55%, #f8fafc 100%)',
  'exchange-payment': 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 45%, #f5f3ff 100%)',
};

export function helpFigureCanvasStyle(category: HelpCategory): CSSProperties {
  return { background: HELP_FIGURE_CANVAS_BY_CATEGORY[category] ?? FIGURE_CANVAS_DEFAULT };
}
