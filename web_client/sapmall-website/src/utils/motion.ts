/** 动效 stagger 间隔（毫秒） */
export const STAGGER_MS = 70;

/** 单组 stagger 最大延迟，避免瀑布过长 */
export const STAGGER_MAX_MS = 420;

/** 计算 capped stagger delay */
export function staggerDelay(index: number, step = STAGGER_MS, max = STAGGER_MAX_MS): number {
  return Math.min(index * step, max);
}
