import type { HelpCategory } from '../types';
import type { TopicQaLocaleText } from '../mocks/helpTopicQaCatalog';

export type TopicQaRichLocale = TopicQaLocaleText & {
  intro: string;
  stepsTitle: string;
  steps: string[];
  tip: string;
  detailHeading: string;
  detail: string;
  figureCaption: string;
};

const CATEGORY_DETAIL: Record<HelpCategory, { zh: string; en: string }> = {
  'getting-started': {
    zh: '建议首次操作使用小额资产试跑全流程。若页面长时间无响应，可切换网络或清除浏览器缓存后重试。',
    en: 'Use a small amount for your first run. If the page stalls, switch network or clear cache and retry.',
  },
  'wallet-security': {
    zh: '任何索要助记词、私钥或要求站外转账的行为均为诈骗。请仅通过帮助中心公示渠道联系官方支持。',
    en: 'Anyone asking for seed phrase, private key, or off-platform transfers is a scam. Use official channels only.',
  },
  'exchange-payment': {
    zh: '兑换前请核对代币合约地址与网络；大额操作建议分笔进行并保留 TxHash 备查。',
    en: 'Verify token contract and network before swapping. Split large trades and keep TxHash records.',
  },
  marketplace: {
    zh: '下单前请仔细阅读商品交付方式、有效期与退款政策；链上支付确认后订单状态会自动更新。',
    en: 'Read delivery, expiry, and refund policy before checkout. Order status updates after on-chain confirmation.',
  },
  merchant: {
    zh: '商家后台修改需符合平台审核规范；保证金与结算以协议及后台公示为准。',
    en: 'Admin changes must meet listing rules. Deposit and settlement follow agreement and dashboard notices.',
  },
  'order-support': {
    zh: '联系客服时请提供订单号、钱包地址与 TxHash，可显著缩短处理时间。',
    en: 'Provide order ID, wallet address, and TxHash when contacting support for faster resolution.',
  },
  'dao-community': {
    zh: '治理相关链上操作不可逆，投票前请确认提案来源与合约地址均为官方公示。',
    en: 'Governance actions are on-chain and final—verify proposal source and contract before voting.',
  },
};

const splitSteps = (body: string, locale: 'zh' | 'en'): string[] => {
  const splitRe = locale === 'zh' ? /[；;。]/ : /[.;]/;
  const parts = body
    .split(splitRe)
    .map((s) => s.trim())
    .filter((s) => s.length > 4);
  if (parts.length >= 2) {
    return parts.slice(0, 6);
  }
  const lead =
    locale === 'zh'
      ? '在 SapMall 页头完成钱包连接并确认网络正确'
      : 'Connect your wallet from the SapMall header and confirm the network';
  const tail =
    locale === 'zh'
      ? '在交易历史中核对结果，必要时联系客服并提供 TxHash'
      : 'Check transaction history; contact support with TxHash if needed';
  return [lead, body, tail];
};

const INTRO_BY_VARIANT: Record<number, { zh: string; en: string }> = {
  0: {
    zh: '下文提供界面示意、分步操作与补充说明。',
    en: 'Below: UI overview, steps, and extra notes.',
  },
  1: {
    zh: '建议按顺序完成以下步骤，再对照文末说明排查问题。',
    en: 'Follow the steps in order, then see notes at the end.',
  },
  2: {
    zh: '先阅读要点与详细说明，再按步骤在应用中操作。',
    en: 'Read the overview first, then follow the steps in the app.',
  },
  3: {
    zh: '结合示意图与操作清单，可快速完成本主题相关设置。',
    en: 'Use the diagram and checklist to finish setup quickly.',
  },
  4: {
    zh: '注意前置条件与风险提示后，按清单逐项执行即可。',
    en: 'Check prerequisites and risks, then work through the checklist.',
  },
  5: {
    zh: '核心步骤与图示如下，遇到异常可查看文末详细说明。',
    en: 'Core steps and figures below; see details at the end if stuck.',
  },
};

const STEPS_TITLE_BY_VARIANT: Record<number, { zh: string; en: string }> = {
  0: { zh: '操作步骤', en: 'Steps' },
  1: { zh: '分步指南', en: 'Step-by-step' },
  2: { zh: '推荐流程', en: 'Recommended flow' },
  3: { zh: '操作清单', en: 'Checklist' },
  4: { zh: '快速清单', en: 'Quick checklist' },
  5: { zh: '实施步骤', en: 'How to do it' },
};

const DETAIL_HEADING_BY_VARIANT: Record<number, { zh: string; en: string }> = {
  0: { zh: '详细说明', en: 'Details' },
  1: { zh: '补充说明', en: 'More context' },
  2: { zh: '延伸阅读', en: 'Read more' },
  3: { zh: '常见问题', en: 'FAQ notes' },
  4: { zh: '注意事项', en: 'Notes' },
  5: { zh: '详细解读', en: 'Deep dive' },
};

export const enrichTopicQaRichContent = (
  entry: TopicQaLocaleText,
  category: HelpCategory,
  locale: 'zh' | 'en',
  layoutVariant: number,
): TopicQaRichLocale => {
  const variant = layoutVariant % 6;
  const steps = splitSteps(entry.body, locale);
  const extra = CATEGORY_DETAIL[category][locale];
  const introLead = INTRO_BY_VARIANT[variant][locale];
  const intro = `${entry.body} ${introLead}`;
  const detail =
    locale === 'zh'
      ? `${entry.body} ${extra} 若与产品界面有差异，以实际界面与公告为准。`
      : `${entry.body} ${extra} If the UI differs, follow in-app labels and announcements.`;
  const tip =
    variant === 1 || variant === 4
      ? locale === 'zh'
        ? `注意：操作前请核对页面域名与钱包弹窗中的地址、金额；勿向他人透露助记词。`
        : `Warning: Verify domain and wallet popup before confirming; never share your seed phrase.`
      : locale === 'zh'
        ? `提示：操作前请再次核对页面域名与钱包弹窗中的地址、金额，避免钓鱼与误操作。`
        : `Tip: Verify the site domain and wallet popup address/amount before confirming.`;
  const figureCaption =
    locale === 'zh'
      ? `图示：${entry.title.replace(/[？?]$/, '')}相关界面示意`
      : `Figure: ${entry.title.replace(/[?]$/, '')} — UI overview`;

  return {
    ...entry,
    intro,
    stepsTitle: STEPS_TITLE_BY_VARIANT[variant][locale],
    steps,
    tip,
    detailHeading: DETAIL_HEADING_BY_VARIANT[variant][locale],
    detail,
    figureCaption,
  };
};
