/** 幻灯片中英全文案，供脚本写入 translation.json */
module.exports = {
  zh: {
    cover: {
      navTitle: '封面',
      title: 'Sapphire Mall项目介绍',
      subtitle: '去中心化社区自驱动的虚拟商品交易平台',
      footer: 'Sapphire Mall 品牌宣传部',
    },
    toc: {
      navTitle: '目录',
      title: '目录',
      items: ['平台简介', '传统电商痛点', '去中心化优势', '角色与收益模型', '现有功能与入口', '未来发展规划'],
    },
    intro: {
      navTitle: '平台简介',
      title: '平台简介',
      intro:
        'Sapphire Mall 是一个基于区块链的去中心化虚拟商品交易平台，以社区 DAO 治理为核心，采用 ERC-20 代币 SAP 作为生态通证。支付体系的核心优势：',
      bullets: [
        {
          title: '稳定币直付',
          desc: '集成 Arc Testnet，支持 USDC、EURC、cirBTC 等稳定币直接支付，商品以 USDC 统一计价，链上实时换算，近秒级确认、低 Gas，单链完成全流程。',
        },
        {
          title: '跨链免桥接',
          desc: '用户可从多条链携带不同资产直接结账，无需手动桥接。后端 PaymentRouter 与 SettlementVault 统一路由资金流，降低多资产用户的支付与对账成本。',
        },
        {
          title: 'SAP 通证激励',
          desc: 'SAP 作为原生支付手段，结合社区任务与治理激励，提供手续费减免，形成「交易—激励—治理」闭环。',
        },
      ],
    },
    overview: {
      navTitle: '平台核心概览',
      title: '平台核心概览',
      subtitle: 'Sapphire Mall的核心构成与运行逻辑',
      rows: [
        {
          title: '区块链技术底座',
          desc: '平台基于区块链技术构建，利用智能合约执行核心业务逻辑，确保交易的安全、透明与不可篡改。',
        },
        {
          title: '稳定币与SAP共治',
          desc: '基于Arc的稳定币支付体系，使用EURC、USDC、cirBTC等主流稳定币及平台原生代币SAP作为支付手段，实现秒级支付与跨链兑换。',
        },
        {
          title: '社区共建共治',
          desc: '引入DAO治理模式，让买家、创作者、贡献者等多元角色共同参与平台决策，共享平台发展红利。',
        },
        {
          title: '多语言与国际化',
          desc: '内置中英文支持与响应式体验，面向全球用户拓展市场与社区。',
        },
      ],
    },
    architecture: {
      navTitle: '技术架构解析',
      title: '技术架构解析',
      subtitle: '深入了解平台的技术实现与支付体系',
      rows: [
        {
          title: '双轨支付系统',
          desc: '采用稳定币与SAP双轨支付，既满足用户对价值稳定的需求，又通过SAP赋能生态治理与激励。',
        },
        {
          title: '智能合约承载规则',
          desc: '核心业务规则由链上智能合约承载，订单与资产状态公开可查，极大降低平台方随意修改规则的风险。',
        },
        {
          title: '订单状态可追溯',
          desc: '所有交易信息记录在区块链上，从下单到履约的全流程均可追溯、可审计，保障交易公正性。',
        },
        {
          title: '支持多链部署',
          desc: '未来规划包含多链部署，可接入Ethereum、Polygon、BSC等主流公链，拓展用户与资产范围。',
        },
      ],
    },
    painpoints: {
      navTitle: '传统电商痛点',
      title: '传统电商痛点',
      bullets: [
        '入驻费、保证金与营销预算流向不透明，商家侧难以审计与对账。',
        '交易资金依赖平台托管与中心化清结算，存在对手方与挪用风险。',
        '纠纷处理依赖平台单方规则与信誉背书，过程与结果难被用户验证。',
        '虚拟商品确权与分账规则常不透明，创作者收益保障不足。',
        '跨境支付与多币种成本高，治理参与弱，用户难以分享平台成长红利。',
        '平台和商家结算周期过长且不透明。',
      ],
    },
    web2limits: {
      navTitle: 'Web2电商局限',
      title: 'Web2电商局限',
      subtitle: '传统电商模式下的典型问题与信任危机',
      cells: [
        {
          title: '费用流向不透明',
          desc: '商家入驻费、保证金及营销预算的去向难以审计和对账，平台方掌握绝对话语权。',
        },
        {
          title: '资金托管风险',
          desc: '交易资金依赖平台托管与中心化清结算，存在对手方跑路、资金被挪用的潜在风险。',
        },
        {
          title: '纠纷处理不公正',
          desc: '纠纷处理依赖平台单方规则和信誉背书，用户难以验证处理过程的公平性与结果的合理性。',
        },
        {
          title: '跨境支付成本高',
          desc: '跨境交易面临复杂的金融监管和较高的支付手续费，且用户参与平台治理的途径有限。',
        },
      ],
    },
    merchant: {
      navTitle: '商家局限性与影响',
      title: '商家的局限性与影响',
      subtitle: '痛点最终转嫁，影响商家经营活力与收益保障',
      cols: [
        {
          title: '结算周期长且模糊',
          desc: '平台和商家之间的结算周期过长且不透明，严重占用商家流动资金，影响资金周转效率。',
        },
        {
          title: '创作者权益保障弱',
          desc: '虚拟商品的确权、版权保护和分账规则通常不透明，导致创作者收益难以得到充分保障。',
        },
        {
          title: '用户数据被平台垄断',
          desc: '用户数据完全由平台掌控，商家无法建立属于自己的用户资产，难以进行深度用户运营。',
        },
      ],
    },
    decentral: {
      navTitle: '去中心化优势',
      title: '去中心化优势',
      bullets: [
        '链上结算与支付周期短',
        '纠纷处理公正公开透明',
        '全球化与体验',
        '社区与多角色价值对齐',
        '平台社区驱动',
      ],
    },
    settlement: {
      navTitle: '链上结算与支付',
      title: '链上结算与支付',
      subtitle: '构建高效、透明的链上清结算体系',
      cards: [
        {
          title: '稳定币支付选项',
          desc: '支持EURC、USDC等主流稳定币支付与跨链支付，为用户提供熟悉且价值稳定的支付选择。',
        },
        {
          title: '链上清结算路径',
          desc: '交易直接在链上进行清结算，路径清晰，到账和状态变更可实时查证，周期短、过程透明。',
        },
        {
          title: '平台通证生态激励',
          desc: '平台原生代币SAP用于生态激励与治理，将平台价值与参与者深度绑定，形成正向循环。',
        },
        {
          title: '交易状态可审计',
          desc: '所有订单和资产状态记录在链上，任何人均可查询审计，保障交易公开透明。',
        },
      ],
    },
    global: {
      navTitle: '全球化与体验',
      title: '全球化与体验',
      subtitle: '打造无国界、友好的Web3用户体验',
      cards: [
        {
          title: '内置多语言支持',
          desc: 'DApp内置中英文(i18n)，文档与产品口径双语，旨在服务全球用户，拓展国际市场。',
        },
        {
          title: '清晰的交易反馈',
          desc: '主交易路径强调钱包连接、网络状态与余额反馈，清晰明了，有效降低用户误操作成本。',
        },
        {
          title: '响应式Web3视觉',
          desc: '采用暗色Web3视觉设计与响应式布局，确保在桌面与移动端均可一屏内完成核心操作。',
        },
      ],
    },
    community: {
      navTitle: '社区与价值对齐',
      title: '社区与价值对齐',
      subtitle: '通过DAO治理和平台多角色实现平台价值共享',
      cards: [
        {
          title: 'DAO社区治理',
          desc: '以SAP作为治理凭证，用户可就费率、功能迭代、金库用途等平台级事项发起提案并投票。',
        },
        {
          title: '多角色收益模型',
          desc: '买家、创作者、社区贡献者等不同角色在同一套规则下各取所需，共享平台发展成果。',
        },
        {
          title: '平台金库透明管理',
          desc: '平台手续费等收入进入DAO金库，用途由社区治理决定，公开透明。',
        },
        {
          title: '从运营驱动到共识驱动',
          desc: '平台运营决策逐步从单一运营方过渡到社区共识驱动，确保发展方向公平可持续。',
        },
      ],
    },
    roles: {
      navTitle: '角色与收益模型',
      title: '角色与收益模型',
      bullets: [
        {
          title: '普通用户 / 买家',
          desc: '浏览购买虚拟商品；可参与治理投票、审核、仲裁与任务获取 SAP 或权益。',
        },
        {
          title: '创作者 / 认证商家',
          desc: '完成认证后上架商品（元数据与文件可走 IPFS 等去中心化存储）；销售收入归创作者，平台按规则收取手续费。',
        },
        {
          title: '社区贡献者 / 陪审员',
          desc: '参与商品审核与纠纷裁决，按规则获得激励；陪审资格与商家保证金等与 SAP 关联。',
        },
        {
          title: '平台 / DAO 金库',
          desc: '手续费与部分费用进入金库，由 DAO 决定回购销毁、生态激励或建设投入。',
        },
      ],
    },
    rolesDetail: {
      navTitle: '角色与收益模型详述',
      title: '角色与收益模型',
      bullets: [
        {
          title: '普通用户 / 买家',
          desc: '浏览购买虚拟商品；可参与治理投票、审核、仲裁与任务获取 SAP 或权益。',
        },
        {
          title: '创作者 / 认证商家',
          desc: '完成认证后上架商品；销售收入归创作者，平台按规则收取手续费等。',
        },
        {
          title: '社区贡献者 / 陪审员',
          desc: '参与商品审核与纠纷裁决，按规则获得激励；陪审资格与商家保证金等与 SAP 关联。',
        },
        {
          title: '平台 / DAO 金库',
          desc: '手续费与部分费用进入金库，由 DAO 决定回购销毁、生态激励或建设投入。',
        },
      ],
    },
    fourRoles: {
      navTitle: '平台四大角色',
      title: '平台四大角色',
      subtitle: '清晰定义平台生态中各参与方的身份与职责',
      cards: [
        {
          title: '普通用户/买家',
          desc: '浏览和购买虚拟商品，同时可参与治理投票、审核、仲裁等任务以获取SAP或权益。',
        },
        {
          title: '创作者/认证商家',
          desc: '完成认证后可上架商品（元数据与文件可走IPFS等去中心化存储），享有销售商品的全部收入。',
        },
        {
          title: '社区贡献者/陪审员',
          desc: '参与商品审核与交易纠纷裁决，为平台生态健康运行贡献力量，并按规则获得相应激励。',
        },
        {
          title: '平台/DAO金库',
          desc: '作为平台核心资金管理机构，负责接收手续费等收入，并根据DAO治理决策进行资金分配。',
        },
      ],
    },
    roleIncentives: {
      navTitle: '角色收益与激励',
      title: '角色收益与激励',
      subtitle: '明确不同角色的经济回报与参与动力',
      cards: [
        {
          title: '创作者销售收入',
          desc: '创作者拥有定价权，销售收入归创作者所有，平台仅收取少量手续费。',
        },
        {
          title: '陪审员审核激励',
          desc: '社区贡献者担任审核/仲裁陪审员，按贡献获得SAP代币或权益奖励。',
        },
        {
          title: '买家参与治理权益',
          desc: 'SAP持有者可参与平台治理投票，影响发展方向，并分享生态成长收益。',
        },
        {
          title: '金库资金分配',
          desc: '金库收入用于回购销毁、激励发放与长期建设，与平台增长深度绑定。',
        },
      ],
    },
    featuresEntry: {
      navTitle: '现有功能与入口',
      title: '现有功能与入口',
      bullets: ['DApp 用户端 (sapmall-dapp)', '官网站点 (sapmall-website)', '管理后台 (sapmall-admin)'],
    },
    dappFeatures: {
      navTitle: '平台DApp核心功能',
      title: '平台DApp核心功能',
      subtitle: 'Sapphire Mall DApp用户端的主要功能',
      cards: [
        {
          title: '商城浏览',
          desc: '支持代币化商品的分类、筛选、列表与详情查看，提供便捷的货架浏览能力。',
        },
        {
          title: '生态活动聚合',
          desc: '聚合各类活动与奖励规则说明，用户可在此了解并参与Bags等营销活动。',
        },
        {
          title: '资产兑换',
          desc: '提供围绕SAPV/稳定币的兑换与资产相关展示与操作，与活动侧代币严格区分。',
        },
        {
          title: 'DAO社区治理',
          desc: '提供社区参与与治理相关界面，用户可查看治理提案并行使投票权。',
        },
        {
          title: '帮助中心',
          desc: '包含FAQ与详细流程说明，覆盖活动、钱包、支付等常见问题，降低支持成本。',
        },
      ],
    },
    websiteOverview: {
      navTitle: '官网站点概览',
      title: '官网站点概览',
      subtitle: 'Sapphire Mall官方网站与品牌价值',
      cards: [
        {
          title: '品牌叙事与价值主张',
          desc: '官网作为品牌对外窗口，清晰阐述项目愿景、核心优势与商业模式，吸引潜在用户与合作伙伴。',
        },
        {
          title: '产品功能引导',
          desc: '通过直观导航与布局，引导用户了解DApp核心功能模块，如商城、DAO治理、Bags活动等。',
        },
        {
          title: '生态与社区入口',
          desc: '提供社区讨论、开发者文档、合作伙伴计划等链接，连接外部生态与内部社区。',
        },
        {
          title: '动态资讯与公告',
          desc: '发布最新动态、版本更新、重要公告与媒体资讯，保持信息公开透明与及时同步。',
        },
      ],
    },
    adminModules: {
      navTitle: '后台管理功能模块',
      title: '后台管理功能模块介绍',
      subtitle: '多角色后台管理主要功能介绍',
      cards: [
        {
          title: '平台运营仪表盘',
          desc: '提供订单、用户、收入等关键指标的实时监控与分析，为运营决策提供数据支持。',
        },
        {
          title: '用户与商户管理',
          desc: '对平台用户和认证商家进行统一管理，包括状态维护、权限配置等。',
        },
        {
          title: '商品管理',
          desc: '支持商品上架、下架、编辑等维护操作，对应后端 ProductManagement 模块。',
        },
        {
          title: '系统配置管理',
          desc: '对数据字典、系统参数、配置项等进行管理，保障平台灵活性与可配置性。',
        },
      ],
    },
    roadmap: {
      navTitle: '未来发展规划',
      title: '未来发展规划',
      bullets: ['支付与资产规划', '增长与社区规划', '创作者与商业化', '安全与工程化交付'],
    },
    paymentPlan: {
      navTitle: '支付与资产规划',
      title: '支付与资产规划',
      subtitle: '持续深化支付体系与资产能力',
      cards: [
        {
          title: '更多支付资产',
          desc: '在现有“双币支付”基础上，扩展支持更多合规主流稳定币与资产，丰富支付选择。',
        },
        {
          title: '多链网络体验',
          desc: '推进多链部署，优化跨链资产视图与切换体验，提升用户在不同链上的资产操作效率。',
        },
        {
          title: '核心合约深化',
          desc: '持续迭代核心交易、商家认证、商品形态等合约逻辑，从V1 MVP向V2/V3高级版本演进。',
        },
      ],
    },
  },
  en: {
    cover: {
      navTitle: 'Cover',
      title: 'Sapphire Mall Introduction',
      subtitle: 'A community-driven decentralized marketplace for virtual goods',
      footer: 'Sapphire Mall Brand Team',
    },
    toc: {
      navTitle: 'Contents',
      title: 'Contents',
      items: [
        'Platform Intro',
        'E-commerce Pain Points',
        'Decentralization Advantages',
        'Roles & Revenue',
        'Features & Entry',
        'Future Roadmap',
      ],
    },
    intro: {
      navTitle: 'Platform Intro',
      title: 'Platform Introduction',
      intro:
        'Sapphire Mall is a blockchain-based decentralized marketplace for virtual goods, centered on DAO governance with SAP (ERC-20) as the ecosystem token. Payment strengths:',
      bullets: [
        {
          title: 'Stablecoin payments',
          desc: 'Arc Testnet integration for USDC, EURC, cirBTC and more. Goods priced in USDC with near-instant on-chain settlement and low gas.',
        },
        {
          title: 'Bridge-free cross-chain',
          desc: 'Pay with assets from multiple chains without manual bridging. PaymentRouter and SettlementVault unify fund routing.',
        },
        {
          title: 'SAP incentives',
          desc: 'SAP as a native payment option with fee discounts and community incentives — a trade–reward–govern loop.',
        },
      ],
    },
    overview: {
      navTitle: 'Core Overview',
      title: 'Platform Core Overview',
      subtitle: 'Core building blocks and operating logic of Sapphire Mall',
      rows: [
        {
          title: 'Blockchain foundation',
          desc: 'Built on blockchain with smart contracts for core logic — secure, transparent, and immutable.',
        },
        {
          title: 'Stablecoins + SAP',
          desc: 'Arc-based stablecoin payments plus SAP for second-level settlement and cross-chain exchange.',
        },
        {
          title: 'Community co-governance',
          desc: 'DAO governance lets buyers, creators, and contributors decide and share upside.',
        },
        {
          title: 'Multilingual & global',
          desc: 'Built-in bilingual support and responsive UX for a global audience.',
        },
      ],
    },
    architecture: {
      navTitle: 'Architecture',
      title: 'Technical Architecture',
      subtitle: 'How the stack and payment system work',
      rows: [
        {
          title: 'Dual-track payments',
          desc: 'Stablecoins for stability and SAP for governance incentives.',
        },
        {
          title: 'Rules on contracts',
          desc: 'Core rules live on-chain; order and asset state are publicly verifiable.',
        },
        {
          title: 'Traceable orders',
          desc: 'Full order lifecycle is recorded on-chain for auditability and fairness.',
        },
        {
          title: 'Multi-chain ready',
          desc: 'Roadmap includes Ethereum, Polygon, BSC and more to expand users and assets.',
        },
      ],
    },
    painpoints: {
      navTitle: 'Pain Points',
      title: 'Traditional E-commerce Pain Points',
      bullets: [
        'Opaque listing fees, deposits, and marketing spend — hard for merchants to audit.',
        'Funds sit in centralized escrow with counterparty and misappropriation risk.',
        'Disputes follow unilateral platform rules that users cannot verify.',
        'Unclear rights and revenue sharing for virtual goods hurt creators.',
        'High cross-border costs and weak governance — users miss platform upside.',
        'Long, opaque settlement cycles between platforms and merchants.',
      ],
    },
    web2limits: {
      navTitle: 'Web2 Limits',
      title: 'Web2 E-commerce Limits',
      subtitle: 'Typical problems and trust crises in traditional commerce',
      cells: [
        {
          title: 'Opaque fees',
          desc: 'Listing fees, deposits, and marketing budgets are hard to audit; platforms hold absolute power.',
        },
        {
          title: 'Custody risk',
          desc: 'Centralized escrow and clearing create counterparty and misappropriation risk.',
        },
        {
          title: 'Unfair disputes',
          desc: 'Outcomes rely on unilateral rules; users cannot verify fairness.',
        },
        {
          title: 'Costly cross-border',
          desc: 'Heavy regulation and fees, with limited paths for user governance.',
        },
      ],
    },
    merchant: {
      navTitle: 'Merchant Impact',
      title: 'Merchant Limits & Impact',
      subtitle: 'Pain points transfer downstream and hurt merchant vitality',
      cols: [
        {
          title: 'Long settlement cycles',
          desc: 'Opaque settlement ties up working capital and slows turnover.',
        },
        {
          title: 'Weak creator rights',
          desc: 'Unclear rights, copyright, and revenue splits undermine creator income.',
        },
        {
          title: 'Data monopoly',
          desc: 'Platforms own user data; merchants cannot build their own customer assets.',
        },
      ],
    },
    decentral: {
      navTitle: 'Decentralization',
      title: 'Decentralization Advantages',
      bullets: [
        'Fast on-chain settlement and payments',
        'Fair, open, transparent dispute handling',
        'Globalization and UX',
        'Community and multi-role value alignment',
        'Community-driven platform',
      ],
    },
    settlement: {
      navTitle: 'On-chain Settlement',
      title: 'On-chain Settlement & Payments',
      subtitle: 'An efficient, transparent on-chain clearing system',
      cards: [
        {
          title: 'Stablecoin options',
          desc: 'EURC, USDC and more with cross-chain payments — familiar and stable.',
        },
        {
          title: 'On-chain clearing path',
          desc: 'Clear settlement paths with real-time status — short cycles, transparent process.',
        },
        {
          title: 'Token incentives',
          desc: 'SAP powers incentives and governance, binding value to participants.',
        },
        {
          title: 'Auditable status',
          desc: 'Orders and assets on-chain — anyone can query and audit.',
        },
      ],
    },
    global: {
      navTitle: 'Global Experience',
      title: 'Globalization & Experience',
      subtitle: 'A borderless, friendly Web3 user experience',
      cards: [
        {
          title: 'Built-in i18n',
          desc: 'Chinese/English in the DApp and docs to serve global users.',
        },
        {
          title: 'Clear trade feedback',
          desc: 'Wallet, network, and balance feedback reduce user mistakes.',
        },
        {
          title: 'Responsive Web3 UI',
          desc: 'Dark Web3 visuals and responsive layout for desktop and mobile.',
        },
      ],
    },
    community: {
      navTitle: 'Community Value',
      title: 'Community & Value Alignment',
      subtitle: 'Share platform value via DAO governance and multi-role design',
      cards: [
        {
          title: 'DAO governance',
          desc: 'SAP holders propose and vote on fees, features, and treasury use.',
        },
        {
          title: 'Multi-role revenue',
          desc: 'Buyers, creators, and contributors share outcomes under one rule set.',
        },
        {
          title: 'Transparent treasury',
          desc: 'Fees enter the DAO treasury; use is decided by the community.',
        },
        {
          title: 'Consensus-driven ops',
          desc: 'Decisions shift from a single operator to community consensus.',
        },
      ],
    },
    roles: {
      navTitle: 'Roles & Revenue',
      title: 'Roles & Revenue Model',
      bullets: [
        {
          title: 'Users / Buyers',
          desc: 'Browse and buy virtual goods; earn SAP via governance, review, arbitration, and tasks.',
        },
        {
          title: 'Creators / Merchants',
          desc: 'List after certification (IPFS-ready); creators keep sales; platform takes fees by rule.',
        },
        {
          title: 'Contributors / Jurors',
          desc: 'Review listings and disputes for incentives; qualifications link to SAP.',
        },
        {
          title: 'Platform / DAO treasury',
          desc: 'Fees fund buybacks, incentives, or building — decided by the DAO.',
        },
      ],
    },
    rolesDetail: {
      navTitle: 'Roles Detail',
      title: 'Roles & Revenue Model',
      bullets: [
        {
          title: 'Users / Buyers',
          desc: 'Browse and buy; join governance, review, arbitration, and tasks for SAP or rights.',
        },
        {
          title: 'Creators / Merchants',
          desc: 'List after certification; creators keep sales revenue; platform fees by rule.',
        },
        {
          title: 'Contributors / Jurors',
          desc: 'Review and adjudicate for incentives; jury and deposits link to SAP.',
        },
        {
          title: 'Platform / DAO treasury',
          desc: 'Fees enter the treasury for buybacks, incentives, or build-out.',
        },
      ],
    },
    fourRoles: {
      navTitle: 'Four Major Roles',
      title: 'Four Major Roles',
      subtitle: 'Clear identities and duties for every participant',
      cards: [
        {
          title: 'Users / Buyers',
          desc: 'Browse and buy virtual goods; join governance, review, and arbitration for SAP.',
        },
        {
          title: 'Creators / Merchants',
          desc: 'List after certification with IPFS-ready storage; keep full sales revenue.',
        },
        {
          title: 'Contributors / Jurors',
          desc: 'Review products and disputes to keep the ecosystem healthy — earn incentives.',
        },
        {
          title: 'Platform / DAO treasury',
          desc: 'Core fund manager receiving fees and allocating per DAO decisions.',
        },
      ],
    },
    roleIncentives: {
      navTitle: 'Role Incentives',
      title: 'Role Earnings & Incentives',
      subtitle: 'Economic returns and motivation for every role',
      cards: [
        {
          title: 'Creator sales income',
          desc: 'Creators set prices and keep sales; the platform takes a small fee.',
        },
        {
          title: 'Juror review rewards',
          desc: 'Contributors acting as jurors earn SAP or equity by contribution.',
        },
        {
          title: 'Buyer governance rights',
          desc: 'SAP holders vote on direction and share ecosystem growth.',
        },
        {
          title: 'Treasury allocation',
          desc: 'Treasury funds buybacks, incentives, and long-term build tied to growth.',
        },
      ],
    },
    featuresEntry: {
      navTitle: 'Features & Entry',
      title: 'Existing Features & Entry Points',
      bullets: ['DApp client (sapmall-dapp)', 'Official website (sapmall-website)', 'Admin console (sapmall-admin)'],
    },
    dappFeatures: {
      navTitle: 'DApp Features',
      title: 'DApp Core Features',
      subtitle: 'Key capabilities of the Sapphire Mall DApp',
      cards: [
        {
          title: 'Marketplace browse',
          desc: 'Classify, filter, list, and open details for tokenized goods.',
        },
        {
          title: 'Ecosystem campaigns',
          desc: 'Aggregate campaigns and reward rules — e.g. Bags activities.',
        },
        {
          title: 'Asset exchange',
          desc: 'SAPV/stablecoin exchange views, separate from campaign tokens.',
        },
        {
          title: 'DAO governance',
          desc: 'View proposals and vote in community governance UI.',
        },
        {
          title: 'Help center',
          desc: 'FAQ and flows for campaigns, wallets, and payments.',
        },
      ],
    },
    websiteOverview: {
      navTitle: 'Website Overview',
      title: 'Official Website Overview',
      subtitle: 'Sapphire Mall website and brand value',
      cards: [
        {
          title: 'Brand narrative',
          desc: 'Vision, strengths, and business model for users and partners.',
        },
        {
          title: 'Product guidance',
          desc: 'Navigate users to DApp modules: market, DAO, Bags, and more.',
        },
        {
          title: 'Ecosystem entry',
          desc: 'Community, docs, and partner links as an external hub.',
        },
        {
          title: 'News & announcements',
          desc: 'Updates, releases, and media — transparent and timely.',
        },
      ],
    },
    adminModules: {
      navTitle: 'Admin Modules',
      title: 'Admin Function Modules',
      subtitle: 'Multi-role back-office capabilities',
      cards: [
        {
          title: 'Ops dashboard',
          desc: 'Real-time orders, users, and revenue for decisions.',
        },
        {
          title: 'User & merchant admin',
          desc: 'Unified status and permission management.',
        },
        {
          title: 'Product management',
          desc: 'List, delist, and edit goods via ProductManagement.',
        },
        {
          title: 'System configuration',
          desc: 'Dictionaries, parameters, and configs for flexibility.',
        },
      ],
    },
    roadmap: {
      navTitle: 'Future Roadmap',
      title: 'Future Development Plan',
      bullets: [
        'Payment & asset planning',
        'Growth & community planning',
        'Creators & commercialization',
        'Security & engineering delivery',
      ],
    },
    paymentPlan: {
      navTitle: 'Payment & Assets',
      title: 'Payment & Asset Planning',
      subtitle: 'Deepen payment systems and asset capabilities',
      cards: [
        {
          title: 'More payment assets',
          desc: 'Expand beyond dual-track payments with more compliant stablecoins.',
        },
        {
          title: 'Multi-chain UX',
          desc: 'Multi-chain deploy plus clearer cross-chain asset views and switching.',
        },
        {
          title: 'Core contract depth',
          desc: 'Iterate trading, merchant auth, and goods forms from MVP to V2/V3.',
        },
      ],
    },
  },
};
