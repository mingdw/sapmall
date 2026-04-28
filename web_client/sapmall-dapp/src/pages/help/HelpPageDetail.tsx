import React, { useMemo, useState } from 'react';

type HelpCategory =
  | 'all'
  | 'getting-started'
  | 'wallet-security'
  | 'exchange-payment'
  | 'merchant-center'
  | 'order-after-sales';

interface HelpArticle {
  id: string;
  title: string;
  summary: string;
  category: Exclude<HelpCategory, 'all'>;
  tags: string[];
  updatedAt: string;
  hot?: boolean;
}

const categoryLabelMap: Record<HelpCategory, string> = {
  all: '全部',
  'getting-started': '新手入门',
  'wallet-security': '钱包与安全',
  'exchange-payment': '兑换与支付',
  'merchant-center': '商家中心',
  'order-after-sales': '订单与售后',
};

const helpArticles: HelpArticle[] = [
  {
    id: '1',
    title: '如何使用稳定币兑换 SAP 代币？',
    summary: '支持 USDT / USDC 等主流稳定币，一次完成授权与兑换，到账后可直接用于商城消费。',
    category: 'exchange-payment',
    tags: ['SAP', '稳定币', '兑换'],
    updatedAt: '2026-04-28',
    hot: true,
  },
  {
    id: '2',
    title: '为什么使用 SAP 支付手续费更低？',
    summary: '平台对 SAP 支付场景提供手续费减免与活动叠加，结算更快、综合成本更低。',
    category: 'exchange-payment',
    tags: ['手续费', '优惠', '支付'],
    updatedAt: '2026-04-27',
    hot: true,
  },
  {
    id: '3',
    title: '钱包连接失败或签名失败怎么办？',
    summary: '从网络、钱包授权、浏览器缓存三个维度快速排查，常见问题可在 1 分钟内恢复。',
    category: 'wallet-security',
    tags: ['钱包', '签名', '连接'],
    updatedAt: '2026-04-25',
  },
  {
    id: '4',
    title: '商家入驻后如何缴纳保证金？',
    summary: '在后台提交申请单后，会跳转到 DApp 兑换页“商家保证金”区域完成链上支付。',
    category: 'merchant-center',
    tags: ['商家', '保证金', '入驻'],
    updatedAt: '2026-04-28',
    hot: true,
  },
  {
    id: '5',
    title: '订单取消后资金何时退回？',
    summary: '根据支付方式与链上确认状态退回，支持在“交易历史”实时查看退款进度。',
    category: 'order-after-sales',
    tags: ['订单', '退款', '售后'],
    updatedAt: '2026-04-22',
  },
  {
    id: '6',
    title: '如何保护私钥与资产安全？',
    summary: '建议启用硬件钱包、签名前核验域名与参数、避免泄露助记词。',
    category: 'wallet-security',
    tags: ['安全', '私钥', '风控'],
    updatedAt: '2026-04-23',
  },
  {
    id: '7',
    title: '新用户从零开始的 3 分钟流程',
    summary: '连接钱包 → 兑换 SAP → 进入商城下单，快速完成首次链上购物。',
    category: 'getting-started',
    tags: ['新手', '流程', '购物'],
    updatedAt: '2026-04-24',
  },
  {
    id: '8',
    title: '交易哈希如何查询链上状态？',
    summary: '在帮助中心可直接复制哈希并跳转区块浏览器，核验确认数与执行结果。',
    category: 'order-after-sales',
    tags: ['链上', 'TxHash', '查询'],
    updatedAt: '2026-04-21',
  },
];

const HelpPageDetail: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState<HelpCategory>('all');

  const quickTags = ['支付失败', '商家保证金', '钱包连接', '退款进度', '手续费优惠'];

  const faqTop = useMemo(() => helpArticles.filter((item) => item.hot), []);

  const filteredArticles = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();
    return helpArticles.filter((item) => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      const keywordMatch =
        !lowerKeyword ||
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.summary.toLowerCase().includes(lowerKeyword) ||
        item.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword));
      return categoryMatch && keywordMatch;
    });
  }, [activeCategory, keyword]);

  return (
    <div className="p-6 min-h-full text-white">
      <div className="max-w-[1320px] mx-auto space-y-6">
        <section className="rounded-2xl border border-purple-400/25 bg-gradient-to-r from-[#161635] via-[#111d3b] to-[#122842] p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">帮助中心</h1>
              <p className="text-sm md:text-base text-slate-300 max-w-3xl">
                面向 SAPMall 全流程场景：新手引导、钱包安全、兑换支付、商家入驻与售后问题，一站式答疑与服务支持。
              </p>
            </div>

            <div className="rounded-xl border border-cyan-300/25 bg-black/20 px-4 py-3">
              <div className="flex items-center gap-2 mb-2 text-xs text-cyan-300">
                <i className="fas fa-search" />
                快速搜索问题
              </div>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="例如：如何缴纳保证金、支付失败、钱包签名失败..."
                className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="px-3 py-1.5 text-xs rounded-full border border-purple-300/30 bg-purple-500/10 text-slate-200 hover:bg-purple-500/20 transition"
                  onClick={() => setKeyword(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0f152d]/75 backdrop-blur-sm p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">高频问题</h2>
            <span className="text-xs text-slate-400">优先覆盖核心交易与商家流程</span>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {faqTop.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-cyan-300/40 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold leading-6">{item.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-300/30 text-emerald-300">
                    HOT
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-5">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-[240px_1fr] gap-4">
          <aside className="rounded-2xl border border-white/10 bg-[#0f152d]/75 p-4 h-fit">
            <h3 className="text-sm font-semibold mb-3">问题分类</h3>
            <div className="space-y-2">
              {(Object.keys(categoryLabelMap) as HelpCategory[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${
                    activeCategory === key
                      ? 'bg-cyan-400/20 border border-cyan-300/40 text-cyan-200'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {categoryLabelMap[key]}
                </button>
              ))}
            </div>
          </aside>

          <div className="rounded-2xl border border-white/10 bg-[#0f152d]/75 p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">知识文章</h3>
              <span className="text-xs text-slate-400">共 {filteredArticles.length} 条结果</span>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="rounded-xl border border-yellow-300/30 bg-yellow-400/10 p-4 text-sm text-yellow-100">
                未找到匹配内容，建议尝试更短关键词，或直接提交工单获取人工协助。
              </div>
            ) : (
              <div className="space-y-3">
                {filteredArticles.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-sm md:text-base font-semibold">{item.title}</h4>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">{item.updatedAt}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-6 mb-3">{item.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-full border border-indigo-300/30 bg-indigo-500/10 text-indigo-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">问题还没解决？</h3>
              <p className="text-sm text-slate-300">
                你可以提交工单或联系在线客服，我们会根据问题类型分配给交易、商家或技术支持团队。
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-cyan-400/90 hover:bg-cyan-300 text-slate-900 text-sm font-semibold transition"
              >
                提交问题工单
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-white/25 bg-white/10 hover:bg-white/15 text-sm transition"
              >
                查看我的工单
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpPageDetail;
