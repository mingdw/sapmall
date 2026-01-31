// 商品详情常用模板

export interface DetailTemplate {
  id: string;
  name: string;
  category: 'detail' | 'packing' | 'afterSale';
  content: string;
}

// 商品详情模板
export const DETAIL_TEMPLATES: DetailTemplate[] = [
  {
    id: 'detail-1',
    name: '标准商品详情',
    category: 'detail',
    content: `<h2>产品介绍</h2>
<p>欢迎了解我们的优质产品。本产品经过精心设计，为您提供卓越的使用体验。</p>

<h3>产品特点</h3>
<ul>
  <li>高品质材料，经久耐用</li>
  <li>精心设计，符合人体工学</li>
  <li>多种规格可选，满足不同需求</li>
</ul>

<h3>适用场景</h3>
<p>适用于家庭、办公、商业等多种场景，为您的生活和工作带来便利。</p>

<h3>注意事项</h3>
<p>请按照说明书正确使用，避免不当操作导致损坏。</p>`,
  },
  {
    id: 'detail-2',
    name: '电子产品详情',
    category: 'detail',
    content: `<h2>产品概述</h2>
<p>这是一款功能强大的电子产品，集成了多项先进技术，为您带来全新的使用体验。</p>

<h3>核心功能</h3>
<ul>
  <li>高性能处理器，运行流畅</li>
  <li>高清显示屏，色彩鲜艳</li>
  <li>长续航电池，持久耐用</li>
  <li>智能操作系统，操作简便</li>
</ul>

<h3>技术参数</h3>
<ul>
  <li>处理器：高性能多核处理器</li>
  <li>内存：大容量存储空间</li>
  <li>屏幕：高清显示技术</li>
  <li>电池：长续航设计</li>
</ul>

<h3>使用说明</h3>
<p>首次使用前请仔细阅读使用手册，确保正确操作。如有疑问，请联系客服。</p>`,
  },
  {
    id: 'detail-3',
    name: '服装类商品详情',
    category: 'detail',
    content: `<h2>商品描述</h2>
<p>精选优质面料，舒适透气，为您带来舒适的穿着体验。</p>

<h3>面料特点</h3>
<ul>
  <li>100%纯棉材质，柔软亲肤</li>
  <li>透气性好，四季皆宜</li>
  <li>易清洗，不易变形</li>
</ul>

<h3>尺码说明</h3>
<p>请参考尺码表选择合适的尺码。如有疑问，可咨询客服。</p>

<h3>洗涤说明</h3>
<ul>
  <li>建议手洗或轻柔机洗</li>
  <li>水温不超过30度</li>
  <li>不可漂白，不可烘干</li>
  <li>平铺晾干，避免暴晒</li>
</ul>`,
  },
];

// 包装清单模板
export const PACKING_TEMPLATES: DetailTemplate[] = [
  {
    id: 'packing-1',
    name: '标准包装清单',
    category: 'packing',
    content: `<h3>包装清单</h3>
<ul>
  <li>产品主体 × 1</li>
  <li>使用说明书 × 1</li>
  <li>保修卡 × 1</li>
  <li>合格证 × 1</li>
</ul>

<p><strong>注意：</strong>收到商品后请检查包装是否完整，如有缺失请及时联系客服。</p>`,
  },
  {
    id: 'packing-2',
    name: '电子产品包装',
    category: 'packing',
    content: `<h3>包装清单</h3>
<ul>
  <li>主机 × 1</li>
  <li>电源适配器 × 1</li>
  <li>数据线 × 1</li>
  <li>使用说明书 × 1</li>
  <li>保修卡 × 1</li>
  <li>快速入门指南 × 1</li>
</ul>

<p><strong>温馨提示：</strong>请妥善保管包装盒和配件，以便后续使用或维修。</p>`,
  },
  {
    id: 'packing-3',
    name: '服装类包装',
    category: 'packing',
    content: `<h3>包装清单</h3>
<ul>
  <li>服装 × 1</li>
  <li>吊牌 × 1</li>
  <li>包装袋 × 1</li>
</ul>

<p><strong>注意：</strong>商品已进行专业包装，确保运输过程中不受损坏。</p>`,
  },
];

// 售后服务模板
export const AFTER_SALE_TEMPLATES: DetailTemplate[] = [
  {
    id: 'afterSale-1',
    name: '标准售后服务',
    category: 'afterSale',
    content: `<h3>售后服务承诺</h3>
<p>我们致力于为您提供优质的售后服务，确保您的购物体验。</p>

<h4>保修政策</h4>
<ul>
  <li>产品享受一年质保服务</li>
  <li>质保期内免费维修（非人为损坏）</li>
  <li>提供全国联保服务</li>
</ul>

<h4>退换货政策</h4>
<ul>
  <li>7天无理由退换货</li>
  <li>商品需保持原包装和标签完整</li>
  <li>非质量问题退换货需承担运费</li>
</ul>

<h4>联系方式</h4>
<p>如有任何问题，请联系我们的客服团队：</p>
<ul>
  <li>客服热线：400-XXX-XXXX</li>
  <li>在线客服：工作日 9:00-18:00</li>
  <li>邮箱：service@example.com</li>
</ul>`,
  },
  {
    id: 'afterSale-2',
    name: '电子产品售后',
    category: 'afterSale',
    content: `<h3>售后服务说明</h3>
<p>我们为所有电子产品提供完善的售后服务保障。</p>

<h4>保修服务</h4>
<ul>
  <li>整机保修一年，主要部件保修两年</li>
  <li>保修期内免费上门维修服务</li>
  <li>提供延保服务可选</li>
</ul>

<h4>技术支持</h4>
<ul>
  <li>7×24小时在线技术支持</li>
  <li>提供远程协助服务</li>
  <li>定期软件更新服务</li>
</ul>

<h4>退换货</h4>
<ul>
  <li>15天无理由退换货</li>
  <li>质量问题免费退换</li>
  <li>提供快速换货服务</li>
</ul>`,
  },
  {
    id: 'afterSale-3',
    name: '服装类售后',
    category: 'afterSale',
    content: `<h3>售后服务政策</h3>
<p>我们承诺为每一位顾客提供满意的售后服务。</p>

<h4>退换货政策</h4>
<ul>
  <li>7天无理由退换货</li>
  <li>尺码不合适可免费换货</li>
  <li>质量问题免费退换货</li>
</ul>

<h4>质量保证</h4>
<ul>
  <li>所有商品均为正品保证</li>
  <li>提供质量检测报告</li>
  <li>支持第三方质检</li>
</ul>

<h4>客服服务</h4>
<ul>
  <li>专业客服团队在线服务</li>
  <li>快速响应，及时处理</li>
  <li>提供个性化购物建议</li>
</ul>`,
  },
];

// 获取所有模板
export const getAllTemplates = (): DetailTemplate[] => {
  return [...DETAIL_TEMPLATES, ...PACKING_TEMPLATES, ...AFTER_SALE_TEMPLATES];
};

// 根据类别获取模板
export const getTemplatesByCategory = (category: 'detail' | 'packing' | 'afterSale'): DetailTemplate[] => {
  switch (category) {
    case 'detail':
      return DETAIL_TEMPLATES;
    case 'packing':
      return PACKING_TEMPLATES;
    case 'afterSale':
      return AFTER_SALE_TEMPLATES;
    default:
      return [];
  }
};
