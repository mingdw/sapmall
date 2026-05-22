/** 帮助中心指标数字展示（阅读量等） */
export const formatHelpMetricNumber = (value: number, locale: string): string => {
  const isZh = locale.startsWith('zh');
  if (value >= 10000) {
    const scaled = value / 10000;
    const text = scaled >= 10 ? Math.round(scaled).toString() : scaled.toFixed(1).replace(/\.0$/, '');
    return isZh ? `${text}万` : `${text}w`;
  }
  if (value >= 1000) {
    const scaled = value / 1000;
    const text = scaled >= 10 ? Math.round(scaled).toString() : scaled.toFixed(1).replace(/\.0$/, '');
    return isZh ? `${text}k` : `${text}k`;
  }
  return String(value);
};

export const computeHelpViewCount = (
  category: string,
  index: number,
  slug: string,
): number => {
  const seed = slug.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return 680 + index * 193 + category.length * 97 + (seed % 420);
};
