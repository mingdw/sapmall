export type HeroMetricNumeric = {
  type: 'numeric';
  target: number;
  decimals: number;
  prefix: string;
  suffix: string;
};

export type HeroMetricStatic = {
  type: 'static';
  text: string;
};

export type ParsedHeroMetricValue = HeroMetricNumeric | HeroMetricStatic;

const formatNumber = (value: number, decimals: number): string => {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  return String(Math.round(value));
};

export const formatHeroMetricNumeric = (parsed: HeroMetricNumeric, current: number): string => {
  const body = formatNumber(current, parsed.decimals);
  return `${parsed.prefix}${body}${parsed.suffix}`;
};

/** 解析右侧指标文案，支持 128 / 2.8K / 68% / #5 / 3d；S2 等保持静态 */
export const parseHeroMetricValue = (raw: string): ParsedHeroMetricValue => {
  const text = raw.trim();

  if (!text) {
    return { type: 'static', text: '' };
  }

  if (/^S\d+$/i.test(text)) {
    return { type: 'static', text };
  }

  const hash = /^#(\d+(?:\.\d+)?)$/.exec(text);
  if (hash) {
    return {
      type: 'numeric',
      target: Number(hash[1]),
      decimals: hash[1].includes('.') ? 1 : 0,
      prefix: '#',
      suffix: '',
    };
  }

  const percent = /^(\d+(?:\.\d+)?)%$/.exec(text);
  if (percent) {
    return {
      type: 'numeric',
      target: Number(percent[1]),
      decimals: percent[1].includes('.') ? 1 : 0,
      prefix: '',
      suffix: '%',
    };
  }

  const kilo = /^(\d+(?:\.\d+)?)K$/i.exec(text);
  if (kilo) {
    return {
      type: 'numeric',
      target: Number(kilo[1]),
      decimals: kilo[1].includes('.') ? 1 : 0,
      prefix: '',
      suffix: 'K',
    };
  }

  const days = /^(\d+(?:\.\d+)?)d$/i.exec(text);
  if (days) {
    return {
      type: 'numeric',
      target: Number(days[1]),
      decimals: days[1].includes('.') ? 1 : 0,
      prefix: '',
      suffix: 'd',
    };
  }

  const plain = /^(\d+(?:\.\d+)?)$/.exec(text);
  if (plain) {
    return {
      type: 'numeric',
      target: Number(plain[1]),
      decimals: plain[1].includes('.') ? 1 : 0,
      prefix: '',
      suffix: '',
    };
  }

  return { type: 'static', text };
};
