/**
 * 合并官网首页新增 i18n 文案（P0-P3）
 */
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');

const patchEn = {
  nav: {
    howItWorks: 'How It Works',
    networks: 'Networks',
    roadmap: 'Roadmap',
    faq: 'FAQ',
  },
  common: {
    comingSoon: 'Coming soon',
    exampleData: 'Sample metrics for demonstration',
    skipToContent: 'Skip to main content',
    step: 'Step',
  },
  stats: {
    disclaimer: 'Sample data for preview only',
  },
  howItWorks: {
    title: 'How Sapphire Mall works',
    subtitle: 'From browsing to on-chain settlement in three clear steps.',
    steps: [
      {
        title: 'Browse & select',
        desc: 'Explore virtual goods in the marketplace, pick a SKU, and review pricing before checkout.',
      },
      {
        title: 'Pay with your wallet',
        desc: 'Connect a Web3 wallet and pay with USDC, SAP, or other supported tokens on your chosen network.',
      },
      {
        title: 'Confirm on-chain',
        desc: 'PaymentRouter records the order on-chain; the platform updates order status after confirmation.',
      },
    ],
    previewCaption: 'Marketplace preview — launch the DApp for the full experience.',
  },
  networks: {
    title: 'Supported networks & tokens',
    subtitle: 'Multi-chain payments on testnets today, aligned with the DApp chain configuration.',
    chainsLabel: 'Payment networks',
    tokensLabel: 'Payment tokens',
    tokensNote: 'Token availability depends on the network selected in your wallet.',
  },
  roadmap: {
    title: 'Product roadmap',
    subtitle: 'Where we are headed — milestones may adjust as the ecosystem evolves.',
    phases: [
      {
        period: 'Q1 2026',
        title: 'Core marketplace',
        items: ['Mainnet/testnet launch', 'Multi-token checkout', 'Order status sync'],
      },
      {
        period: 'Q2 2026',
        title: 'Ecosystem expansion',
        items: ['Additional chains', 'SAP utility expansion', 'Creator tools'],
      },
      {
        period: 'Q3 2026',
        title: 'Community & mobile',
        items: ['DAO governance rollout', 'Mobile-friendly flows', 'Regional support'],
      },
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    subtitle: 'Quick answers before you connect your wallet.',
    items: [
      {
        q: 'Which wallets are supported?',
        a: 'Any wallet compatible with WalletConnect / injected providers supported by our DApp (e.g. MetaMask).',
      },
      {
        q: 'Which tokens can I pay with?',
        a: 'USDC and SAP are supported on payment chains; Arc Testnet also supports EURC and cirBTC where configured.',
      },
      {
        q: 'Is SAP payment live?',
        a: 'SAP is listed in the payment UI; on-chain SAP checkout is rolling out — USDC is recommended for production tests.',
      },
      {
        q: 'How does contributor revenue sharing work?',
        a: 'Active contributors earn a share of platform fees according to published tokenomics — see the whitepaper for details.',
      },
      {
        q: 'Where can I get help?',
        a: 'Use the in-app Help center or contact support via the email listed in the About section.',
      },
    ],
  },
  docsSection: {
    cards: {
      whitepaper: { title: 'Whitepaper', desc: 'Tokenomics, governance, and platform design.' },
      help: { title: 'Help center', desc: 'Wallet, payment, and troubleshooting guides.' },
      github: { title: 'GitHub', desc: 'Open-source repositories and developer resources.' },
      audit: { title: 'Security & audit', desc: 'Contract addresses and audit reports.' },
    },
  },
  trust: {
    title: 'Security & transparency',
    subtitle: 'Built with on-chain settlement and auditable smart contracts.',
    badges: [
      { title: 'PaymentRouter', desc: 'On-chain payment intents with event-based order sync' },
      { title: 'Multi-chain', desc: 'Configurable networks via platform chain registry' },
      { title: 'Open docs', desc: 'Developer guides and contract references on GitHub' },
    ],
  },
  partners: {
    title: 'Ecosystem',
    subtitle: 'Integrations and networks we build on.',
    items: ['Arc Network', 'Linea', 'Base', 'Ethereum'],
  },
  newsletter: {
    title: 'Stay updated',
    subtitle: 'Product releases, governance votes, and network expansions.',
    placeholder: 'you@example.com',
    button: 'Subscribe',
    success: 'Thanks — we will keep you posted.',
    privacyNote: 'No spam. Unsubscribe anytime.',
    invalidEmail: 'Please enter a valid email address.',
  },
  footer: {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    social: {
      twitter: 'Twitter',
      telegram: 'Telegram',
      discord: 'Discord',
      github: 'GitHub',
    },
    copyright: '© 2026 Sapphire Mall. All rights reserved.',
  },
  legal: {
    privacyTitle: 'Privacy Policy',
    privacyBody: 'We collect only what is needed to operate the marketplace and improve the product. Wallet addresses used for transactions are recorded on-chain; contact details you provide are used for order support. We do not sell personal data. For questions, contact support@sapphiremall.com.',
    termsTitle: 'Terms of Service',
    termsBody: 'By using Sapphire Mall you agree to transact at your own risk on public blockchains. Virtual goods are subject to seller terms and applicable laws. The platform provides infrastructure only and does not custody user funds beyond smart-contract flows described in our documentation.',
  },
};

const patchZh = {
  nav: {
    howItWorks: '如何使用',
    networks: '支持网络',
    roadmap: '路线图',
    faq: '常见问题',
  },
  common: {
    comingSoon: '即将上线',
    exampleData: '以下为演示用示例数据',
    skipToContent: '跳到主要内容',
    step: '步骤',
  },
  stats: {
    disclaimer: '仅为预览展示的示例数据',
  },
  howItWorks: {
    title: '三步完成交易',
    subtitle: '从浏览商品到链上确认，流程清晰可追踪。',
    steps: [
      {
        title: '浏览并选购',
        desc: '在商城浏览虚拟商品，选择 SKU，在结算前确认价格与库存。',
      },
      {
        title: '钱包支付',
        desc: '连接 Web3 钱包，在对应网络上使用 USDC、SAP 等支持的代币完成支付。',
      },
      {
        title: '链上确认',
        desc: 'PaymentRouter 记录链上支付；平台监听事件后更新订单状态。',
      },
    ],
    previewCaption: '商城界面预览 — 启动 DApp 体验完整功能。',
  },
  networks: {
    title: '支持的网络与代币',
    subtitle: '与 DApp 链配置一致，当前支持多条测试网支付。',
    chainsLabel: '支付网络',
    tokensLabel: '支付代币',
    tokensNote: '可用代币取决于钱包当前所选网络。',
  },
  roadmap: {
    title: '产品路线图',
    subtitle: '以下里程碑会随生态进展调整。',
    phases: [
      {
        period: '2026 Q1',
        title: '核心商城',
        items: ['测试网上线', '多代币结算', '订单状态同步'],
      },
      {
        period: '2026 Q2',
        title: '生态扩展',
        items: ['更多链支持', 'SAP 效用扩展', '创作者工具'],
      },
      {
        period: '2026 Q3',
        title: '社区与移动端',
        items: ['DAO 治理推进', '移动友好流程', '多区域支持'],
      },
    ],
  },
  faq: {
    title: '常见问题',
    subtitle: '连接钱包前，先看这些说明。',
    items: [
      {
        q: '支持哪些钱包？',
        a: '支持 DApp 所接入的 WalletConnect / 浏览器注入钱包（如 MetaMask）。',
      },
      {
        q: '可以用哪些代币支付？',
        a: '支付链上支持 USDC、SAP；Arc Testnet 在配置可用时还支持 EURC、cirBTC。',
      },
      {
        q: 'SAP 支付是否已开放？',
        a: 'SAP 已在支付界面展示；链上 SAP 结算逐步开放，测试阶段建议使用 USDC。',
      },
      {
        q: '贡献者分成如何运作？',
        a: '活跃贡献者按已公布的代币经济规则分享平台费用，详见白皮书。',
      },
      {
        q: '遇到问题去哪里？',
        a: '请使用应用内帮助中心，或通过「关于我们」中的支持邮箱联系我们。',
      },
    ],
  },
  docsSection: {
    cards: {
      whitepaper: { title: '白皮书', desc: '代币经济、治理与平台设计。' },
      help: { title: '帮助中心', desc: '钱包、支付与故障排除指南。' },
      github: { title: 'GitHub', desc: '开源仓库与开发者资源。' },
      audit: { title: '安全与审计', desc: '合约地址与审计报告。' },
    },
  },
  trust: {
    title: '安全与透明',
    subtitle: '链上结算，合约可审计。',
    badges: [
      { title: 'PaymentRouter', desc: '链上支付意图，事件驱动订单同步' },
      { title: '多链架构', desc: '通过平台链配置灵活扩展网络' },
      { title: '开放文档', desc: 'GitHub 提供开发者指南与合约说明' },
    ],
  },
  partners: {
    title: '生态网络',
    subtitle: '我们构建与集成的底层网络。',
    items: ['Arc Network', 'Linea', 'Base', 'Ethereum'],
  },
  newsletter: {
    title: '订阅动态',
    subtitle: '产品发布、治理投票与网络扩展资讯。',
    placeholder: 'you@example.com',
    button: '订阅',
    success: '感谢订阅，我们会及时通知您。',
    privacyNote: '不发垃圾邮件，可随时取消订阅。',
    invalidEmail: '请输入有效的邮箱地址。',
  },
  footer: {
    privacy: '隐私政策',
    terms: '服务条款',
    social: {
      twitter: 'Twitter',
      telegram: 'Telegram',
      discord: 'Discord',
      github: 'GitHub',
    },
    copyright: '© 2026 Sapphire Mall. 保留所有权利。',
  },
  legal: {
    privacyTitle: '隐私政策',
    privacyBody: '我们仅收集运营商城与改进产品所必需的信息。交易使用的钱包地址会记录在链上；您提供的联系方式仅用于订单支持。我们不会出售个人数据。如有疑问请联系 support@sapphiremall.com。',
    termsTitle: '服务条款',
    termsBody: '使用 Sapphire Mall 即表示您理解在公链上交易需自行承担风险。虚拟商品受卖家条款与适用法律约束。平台仅提供基础设施，用户资金流转遵循智能合约与公开文档中的说明。',
  },
};

function deepMerge(target, source) {
  const out = { ...target };
  Object.keys(source).forEach((key) => {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], source[key]);
    } else {
      out[key] = source[key];
    }
  });
  return out;
}

['en', 'zh'].forEach((lang) => {
  const file = path.join(localesDir, lang, 'translation.json');
  const current = JSON.parse(fs.readFileSync(file, 'utf8'));
  const patch = lang === 'en' ? patchEn : patchZh;
  const merged = deepMerge(current, patch);
  fs.writeFileSync(file, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Patched ${lang}/translation.json`);
});
