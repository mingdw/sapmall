/** 白皮书结构化内容 —— 对齐 docs/White_Paper.md v0.5.0 */

export type WhitepaperBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'nestedList'; items: { title: string; children?: string[] }[] }
  | { type: 'kv'; items: { label: string; value: string }[] }
  | { type: 'architecture'; layers: { name: string; items: string[] }[] }
  | { type: 'note'; text: string };

export type WhitepaperSection = {
  id: string;
  title: string;
  blocks: WhitepaperBlock[];
};

const zh: WhitepaperSection[] = [
  {
    id: 'intro',
    title: '1. 项目简介 (Abstract / Introduction)',
    blocks: [
      {
        type: 'paragraph',
        text: 'Sapphire Mall 是一个去中心化社区自驱动的虚拟商品交易平台。平台基于区块链构建，以 DAO 社区治理为核心组织决策；采用 ERC-20 代币 SAP 作为生态通证，结合社区任务与治理激励，形成可审计、可参与的 Web3 虚拟商品交易与共治叙事。',
      },
      {
        type: 'paragraph',
        text: '我们致力于解决数字商品市场中的信任缺失、价值分配不公、治理中心化，以及传统电商中结算不透明、跨境支付成本高、创作者权益难保障等问题。通过社区贡献度证明（Proof of Contribution）、去中心化纠纷仲裁、DAO 驱动治理，以及以 Arc 为核心的多稳定币结算，Sapphire Mall 旨在构建由用户共同拥有、建设与管理的价值创造生态。',
      },
      {
        type: 'paragraph',
        text: '愿景：打造公平、透明、高效的 Web3 虚拟商品市场，让消费者、创作者与社区贡献者的价值都能被准确衡量并合理回报。',
      },
      {
        type: 'note',
        text: '核心定位：在 Arc 结算层上完成多稳定币结账，在 SAP / DAO 叙事下完成社区共治与激励，服务数字内容、软件工具、在线服务等虚拟商品交易场景。',
      },
      {
        type: 'kv',
        items: [
          { label: 'sapmall-dapp', value: '用户端 DApp：商城、兑换、生态活动、DAO、帮助中心' },
          { label: 'sapmall-website', value: '项目官网：品牌、白皮书、平台介绍与文档入口' },
          { label: 'sapmall-admin', value: '平台 / 商家运营后台：商品、订单、用户与配置灌流至前台' },
          { label: 'backend_service', value: 'Go + go-zero 微服务、订单与链上事件对齐' },
          { label: '智能合约', value: 'SAP、支付路由与结算金库等（Hardhat / Solidity）' },
        ],
      },
    ],
  },
  {
    id: 'market',
    title: '2. 市场分析与痛点 (Market Analysis & Problem Statement)',
    blocks: [
      {
        type: 'paragraph',
        text: '随着数字经济与元宇宙相关业态发展，虚拟商品交易规模持续扩大。现有中心化平台与「伪 Web3」商城仍普遍存在以下痛点：',
      },
      {
        type: 'nestedList',
        items: [
          {
            title: '用户与信任侧',
            children: [
              '信任成本高：虚假宣传、质量不符、交易欺诈频发，缺乏可验证的信任机制。',
              '纠纷不公正：纠纷依赖平台单方规则与信誉背书，过程与结果难以被用户验证。',
              '跨境与多币种摩擦：跨境支付成本高、路径复杂；用户难以用熟悉的稳定币或跨链资产一次性完成结账。',
            ],
          },
          {
            title: '商家与创作者侧',
            children: [
              '费用与结算不透明：入驻费、保证金、营销预算流向难审计；平台与商家结算周期长且模糊。',
              '确权与分账不清：虚拟商品确权、版权与分账规则常不透明，创作者收益保障不足。',
              '用户资产被垄断：用户数据完全由平台掌控，商家难以沉淀自有用户资产。',
            ],
          },
          {
            title: '治理与价值分配侧',
            children: [
              '中心化审核与仲裁：上架与纠纷最终决定权集中于平台，过程不透明。',
              '价值分配不均：创作者与社区贡献难量化，平台攫取大部分价值。',
              '治理缺失：用户对费率、规则与发展方向缺乏发言权，社区与平台利益易脱节。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'solution',
    title: '3. 解决方案 (Solution)',
    blocks: [
      {
        type: 'paragraph',
        text: 'Sapphire Mall 以「链上可审计的支付与结算 + 社区可参与的治理与激励」重塑虚拟商品交易：',
      },
      {
        type: 'nestedList',
        items: [
          {
            title: '交易与支付',
            children: [
              'Arc 深度集成的稳定币支付：结账对接 Arc Testnet，支持 USDC、EURC、cirBTC 等稳定币 / 链上资产及 SAP；商品以 USDC 统一标价，链上按所选代币实时换算划转。依托 Arc 近秒级确认与低 Gas，用户可在单链完成「选品—授权—支付—确认」。',
              '基于 Arc 的跨链支付体验：多来源资产在 Arc 结算层统一承接，用户无需在多条链之间手动桥接后再支付。后端 PaymentRouter 与 SettlementVault 统一路由支付 intent 与资金流，订单状态与链上 PaymentPaid 事件对齐。',
              'SAP 支付激励：使用 SAP 支付可享受手续费减免等策略，形成「交易—激励—治理」闭环。',
            ],
          },
          {
            title: '社区与治理',
            children: [
              '社区驱动的商品审核：上架商品经社区公开审核投票，从源头保障质量。',
              '去中心化纠纷仲裁（Kleros 启发模型）：由随机抽选的高贡献度成员组成仲裁庭，过程公正透明。',
              '社区贡献度证明（CP）：审核、仲裁、成功提案等有效行为量化为不可交易的声誉凭证 Contribution Point（CP）。',
              'DAO 驱动治理：费率、审核规则、仲裁机制、金库用途等由社区提案与投票决定。',
            ],
          },
          {
            title: '产品体验与运营',
            children: [
              '商城与活动解耦：/marketplace 专注选品与下单；生态活动与奖励聚合在 /rewards。',
              'DAO 议事空间：/dao 聚合提案 / 讨论 / 活动，支持分类标签、富文本与参与统计。',
              '后台灌流冷启动：admin 承担商品、类目、商家 / KYC、订单与看板；审核通过的商品灌流至 DApp。',
              '全球化与多语言：DApp / 官网中英文界面与文档策略一致。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'roles',
    title: '4. 产品角色与价值流 (Roles & Value Flow)',
    blocks: [
      {
        type: 'kv',
        items: [
          {
            label: '普通用户 / 买家',
            value: '浏览、购买虚拟商品；参与治理投票、审核、仲裁与任务 → 商品使用权、SAP / 权益激励、治理话语权',
          },
          {
            label: '创作者 / 认证商家',
            value: '认证后上架（元数据与文件可走 IPFS 等）；经营店铺 → 销售收入、品牌与用户沉淀',
          },
          {
            label: '社区贡献者 / 陪审员',
            value: '商品审核、纠纷裁决、提案共建 → 按规则获得 SAP 等激励；陪审资格与保证金等与 SAP / CP 关联',
          },
          {
            label: '平台 / DAO 金库',
            value: '接收手续费等收入 → 由 DAO 决定回购销毁、生态激励或建设投入',
          },
        ],
      },
      {
        type: 'note',
        text: '北极星指标（产品）：月度活跃贡献者数——反映治理、仲裁与社区任务的活跃度。',
      },
    ],
  },
  {
    id: 'architecture',
    title: '5. 技术架构 (Technical Architecture)',
    blocks: [
      {
        type: 'architecture',
        layers: [
          {
            name: '用户层',
            items: ['官网 sapmall-website', 'DApp sapmall-dapp', '管理后台 sapmall-admin'],
          },
          {
            name: '应用层',
            items: [
              'API 网关 / go-zero',
              '商品服务',
              '订单与支付服务',
              'DAO 治理服务',
              '社区贡献度服务',
              '纠纷仲裁服务',
            ],
          },
          {
            name: '区块链层',
            items: [
              'SAP ERC-20',
              'NFT ERC-721/1155',
              '治理 Governor',
              '贡献度 SBT',
              'PaymentRouter / SettlementVault',
              '仲裁合约（Kleros 启发）',
            ],
          },
          {
            name: '存储层',
            items: ['IPFS / Pinata（商品文件与元数据）', 'MySQL / Redis / MongoDB（业务与缓存）'],
          },
        ],
      },
      {
        type: 'nestedList',
        items: [
          {
            title: '技术选型（与仓库一致）',
            children: [
              '前端：React 18 + TypeScript；DApp 使用 Wagmi + Viem、Web3Modal / ConnectKit；react-i18next。',
              '后端：Go + go-zero + gRPC；MySQL 8 + Redis；etcd 服务发现；链上交互 go-ethereum。',
              '合约：Hardhat + Solidity 0.8.19+；OpenZeppelin；Slither / Mythril 等安全工具；升级与多签（Gnosis Safe）规划。',
              '支付：Arc Testnet — PaymentRouter / SettlementVault；多代币 intent；PaymentPaid 事件与订单状态机对齐。',
              '存储：业务库 + IPFS（商品文件）+ 可选云存储。',
            ],
          },
          {
            title: '安全性原则',
            children: [
              '智能合约计划多轮审计与形式化 / 自动化扫描相结合。',
              '用户私钥自持；交易、投票等核心操作需签名确认。',
              '支付路径链上可审计；订单状态与链上事件双向可对账。',
              '运营后台与 DApp 权限分离，商家发布经审核后灌流前台。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'tokenomics',
    title: '6. 代币经济模型 (Tokenomics)',
    blocks: [
      {
        type: 'note',
        text: '完整参数、释放曲线与激励公式见 Tokenomics_Detailed.md。以下为白皮书摘要。',
      },
      {
        type: 'kv',
        items: [
          { label: '名称', value: 'Sapphire Token（SAP）' },
          { label: '标准', value: 'ERC-20' },
          { label: '类型', value: '功能型实用代币（Utility Token）' },
          { label: '总供应量', value: '100,000,000 SAP' },
        ],
      },
      {
        type: 'nestedList',
        items: [
          {
            title: '核心作用',
            children: [
              '治理：参与 DAO 提案与投票的凭证。',
              '激励：贡献度挖矿及审核、仲裁、成功提案等社区行为的奖励载体。',
              '支付：平台内支付手段之一；使用 SAP 可享手续费折扣等策略。',
            ],
          },
          {
            title: '分配结构（规划）',
            children: [
              '社区激励 / 生态基金：60%（贡献度挖矿、社区活动等线性释放）',
              '团队与顾问：15%（锁仓约 2 年，分期解锁）',
              '早期投资者：15%（锁仓约 1 年，分期解锁）',
              '市场与流动性：10%（上市流动性与市场拓展）',
            ],
          },
        ],
      },
      {
        type: 'note',
        text: '价值捕获：平台交易手续费的一部分可用于回购并销毁 SAP，形成通缩支撑。业务目标示例（规划期）：SAP 支付订单占比 ≥ 总订单 25%。',
      },
    ],
  },
  {
    id: 'roadmap',
    title: '7. 路线图 (Roadmap)',
    blocks: [
      {
        type: 'note',
        text: '详细里程碑见 Roadmap.md。工程状态当前为 Development。',
      },
      {
        type: 'nestedList',
        items: [
          {
            title: '已落地与进行中（对齐当前仓库）',
            children: [
              '官网、DApp、管理后台三端骨架与中英文 i18n。',
              '商城浏览 / 下单主路径；Arc 多稳定币支付 intent 与事件对齐设计。',
              'DAO 提案 / 讨论 / 活动界面；生态活动 /rewards 聚合。',
              '后台商品、订单、用户等运营能力与前台灌流。',
            ],
          },
          {
            title: 'V1.0（MVP）：核心交易与社区审核',
            children: [
              '虚拟商品（含 NFT 形态）创建、发布、浏览与购买。',
              '社区驱动的上架审核；基础 DAO 参数提案。',
              '初版 CP 记录；稳定币 + SAP 双轨支付闭环加固。',
            ],
          },
          {
            title: 'V2.0：治理增强与创作者经济',
            children: [
              '去中心化纠纷仲裁；基于 CP 的贡献度挖矿。',
              '创作者主页、版税等；投票委托提升治理效率。',
            ],
          },
          {
            title: 'V3.0：生态扩展与互操作性',
            children: [
              '更广义多链资产与跨域互操作；开放 API / SDK。',
              '资产可组合性；社区金库由 DAO 资助生态项目。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'team',
    title: '8. 团队与顾问 (Team & Advisors)',
    blocks: [
      {
        type: 'paragraph',
        text: '核心团队由来自科技与区块链行业的产品、工程与设计人员组成，覆盖 DApp、微服务、合约、社区运营与经济模型设计。我们相信愿景一致、执行扎实的团队是长期交付的基础。具体成员与顾问名单将随项目进展在官网与社区渠道更新。',
      },
    ],
  },
  {
    id: 'governance',
    title: '9. 社区与治理 (Community & Governance)',
    blocks: [
      {
        type: 'paragraph',
        text: '最终目标是 Sapphire DAO 下的社区自治。SAP 持有者可参与的范围包括但不限于：',
      },
      {
        type: 'list',
        items: [
          '智能合约升级与安全相关决策',
          '平台关键参数（手续费率、贡献度算法、支付策略等）',
          '社区金库资金用途（回购、激励、建设）',
          '生态发展方向与合作伙伴策略',
        ],
      },
      {
        type: 'note',
        text: '产品侧通过 /dao 的提案、讨论与活动承载日常议事；链上投票进度、规则与结果可展示，并与 SAP 持仓权重叙事一致。沟通渠道包括论坛 / Discussions、社交网络与定期线上会议。',
      },
    ],
  },
  {
    id: 'legal',
    title: '10. 合规与法律声明 (Legal & Compliance)',
    blocks: [
      {
        type: 'paragraph',
        text: '本项目在设计上积极寻求合规路径。SAP 旨在作为功能性实用代币，用于治理、激励与平台内支付，并非证券发行要约。用户应在充分了解管辖地法规、风险并咨询专业人士后参与。文档内容不构成投资建议。',
      },
    ],
  },
  {
    id: 'risk',
    title: '11. 风险提示 (Risk Disclosure)',
    blocks: [
      {
        type: 'paragraph',
        text: '参与本项目可能面临包括但不限于：技术风险（智能合约漏洞、客户端或后端故障、跨链 / 结算路径异常）；市场风险（代币价格波动、流动性不足、稳定币脱锚等）；运营与合规风险（政策变化、牌照与支付合规要求、第三方服务中断）；治理风险（投票参与不足、利益冲突或恶意提案）。请务必自行研究（DYOR），仅投入可承受损失范围内的资金与时间。',
      },
    ],
  },
  {
    id: 'contact',
    title: '12. 联系方式与相关文档 (Contact & References)',
    blocks: [
      {
        type: 'list',
        items: [
          '官网：https://sapmall.xyz',
          'DApp：https://dapp.sapmall.xyz',
          'GitHub：https://github.com/mingdw/sapmall',
          '问题反馈：https://github.com/mingdw/sapmall/issues',
          '社区讨论：Discord（见仓库 README）',
          'Twitter / X：https://x.com/MingDw_1992',
        ],
      },
      {
        type: 'note',
        text: '延伸阅读：README.md（工程结构）、PRD.md、Tokenomics_Detailed.md、Roadmap.md、User_Story_Map.md、Metrics_Framework.md。文档版本 v0.5.0，与仓库 README 核心产品叙事对齐，随实现迭代更新。',
      },
    ],
  },
];

const en: WhitepaperSection[] = [
  {
    id: 'intro',
    title: '1. Abstract / Introduction',
    blocks: [
      {
        type: 'paragraph',
        text: 'Sapphire Mall is a community-driven decentralized marketplace for virtual goods. Built on blockchain with DAO governance at its core, it uses the ERC-20 token SAP as the ecosystem utility token, combining community tasks and governance incentives into an auditable, participatory Web3 trading and co-governance narrative.',
      },
      {
        type: 'paragraph',
        text: 'We address missing trust, unfair value distribution, and centralized governance in digital goods markets, as well as opaque settlement, high cross-border payment costs, and weak creator protections in traditional e-commerce. Through Proof of Contribution, decentralized dispute arbitration, DAO-driven governance, and multi-stablecoin settlement centered on Arc, Sapphire Mall aims to build an ecosystem owned, built, and managed by its users.',
      },
      {
        type: 'paragraph',
        text: 'Vision: a fair, transparent, and efficient Web3 virtual goods market where consumers, creators, and community contributors are accurately measured and fairly rewarded.',
      },
      {
        type: 'note',
        text: 'Positioning: settle in multiple stablecoins on the Arc settlement layer; co-govern and incentivize via SAP / DAO — serving digital content, software tools, online services, and other virtual goods.',
      },
      {
        type: 'kv',
        items: [
          { label: 'sapmall-dapp', value: 'User DApp: marketplace, swap, rewards, DAO, help center' },
          { label: 'sapmall-website', value: 'Marketing site: brand, whitepaper, presentation & docs' },
          { label: 'sapmall-admin', value: 'Ops / merchant console: goods, orders, users — feeds the DApp' },
          { label: 'backend_service', value: 'Go + go-zero microservices; orders aligned with on-chain events' },
          { label: 'Smart contracts', value: 'SAP, payment router & settlement vault (Hardhat / Solidity)' },
        ],
      },
    ],
  },
  {
    id: 'market',
    title: '2. Market Analysis & Problem Statement',
    blocks: [
      {
        type: 'paragraph',
        text: 'As the digital economy and metaverse-adjacent sectors grow, virtual goods trading continues to scale. Centralized platforms and “pseudo-Web3” malls still share recurring problems:',
      },
      {
        type: 'nestedList',
        items: [
          {
            title: 'Users & trust',
            children: [
              'High trust cost: fraud, quality mismatches, and scams; few verifiable trust mechanisms.',
              'Unfair disputes: outcomes depend on opaque platform rules and reputation.',
              'Cross-border & multi-asset friction: costly paths; hard to pay once with familiar stablecoins or cross-chain assets.',
            ],
          },
          {
            title: 'Merchants & creators',
            children: [
              'Opaque fees & settlement: hard-to-audit fees and long, unclear payout cycles.',
              'Unclear rights & revenue share: weak protections for creator earnings.',
              'Platform-owned users: merchants struggle to retain their own customer assets.',
            ],
          },
          {
            title: 'Governance & value',
            children: [
              'Centralized review & arbitration: final say rests with the platform.',
              'Uneven value capture: creator and community contributions are hard to quantify.',
              'Missing governance: users lack voice on fees, rules, and roadmap.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'solution',
    title: '3. Solution',
    blocks: [
      {
        type: 'paragraph',
        text: 'Sapphire Mall rebuilds virtual goods trading around “auditable on-chain payment & settlement + participatory community governance & incentives”:',
      },
      {
        type: 'nestedList',
        items: [
          {
            title: 'Trading & payments',
            children: [
              'Arc-integrated stablecoin payments: checkout on Arc Testnet with USDC, EURC, cirBTC, and SAP; goods priced in USDC with on-chain conversion. Near-second finality and low gas enable select → approve → pay → confirm on one chain.',
              'Cross-chain UX via Arc settlement: assets converge on Arc without manual bridging. PaymentRouter and SettlementVault route payment intents; order state aligns with PaymentPaid events.',
              'SAP payment incentives: fee discounts when paying in SAP, closing the trade–incentive–governance loop.',
            ],
          },
          {
            title: 'Community & governance',
            children: [
              'Community listing review via open voting.',
              'Decentralized arbitration (Kleros-inspired) by randomly selected high-CP peers.',
              'Proof of Contribution: valid actions mint non-transferable Contribution Points (CP).',
              'DAO-driven parameters: fees, review rules, arbitration, and treasury usage.',
            ],
          },
          {
            title: 'Product & operations',
            children: [
              'Marketplace vs rewards: /marketplace for browsing & checkout; /rewards for campaigns.',
              'DAO space: /dao aggregates proposals, discussions, and events.',
              'Admin cold-start: goods, categories, merchants/KYC, orders — approved listings feed the DApp.',
              'Global UX: bilingual DApp and website.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'roles',
    title: '4. Roles & Value Flow',
    blocks: [
      {
        type: 'kv',
        items: [
          {
            label: 'Buyers',
            value: 'Browse & buy; join votes, review, arbitration & tasks → goods access, SAP rewards, governance voice',
          },
          {
            label: 'Creators / verified merchants',
            value: 'List after verification (IPFS metadata/files); run shops → sales revenue, brand & users',
          },
          {
            label: 'Contributors / jurors',
            value: 'Review, adjudicate, co-build proposals → SAP incentives; juror stake tied to SAP / CP',
          },
          {
            label: 'Platform / DAO treasury',
            value: 'Receives fees → DAO decides buyback/burn, incentives, or build spend',
          },
        ],
      },
      {
        type: 'note',
        text: 'North-star metric: monthly active contributors — reflecting governance, arbitration, and community task activity.',
      },
    ],
  },
  {
    id: 'architecture',
    title: '5. Technical Architecture',
    blocks: [
      {
        type: 'architecture',
        layers: [
          {
            name: 'Clients',
            items: ['Website', 'DApp', 'Admin console'],
          },
          {
            name: 'Application',
            items: [
              'API gateway / go-zero',
              'Goods',
              'Orders & payments',
              'DAO',
              'Contribution',
              'Arbitration',
            ],
          },
          {
            name: 'Blockchain',
            items: [
              'SAP ERC-20',
              'NFT ERC-721/1155',
              'Governor',
              'Contribution SBT',
              'PaymentRouter / SettlementVault',
              'Arbitration (Kleros-inspired)',
            ],
          },
          {
            name: 'Storage',
            items: ['IPFS / Pinata', 'MySQL / Redis / MongoDB'],
          },
        ],
      },
      {
        type: 'nestedList',
        items: [
          {
            title: 'Stack (repo-aligned)',
            children: [
              'Frontend: React 18 + TypeScript; Wagmi + Viem; Web3Modal / ConnectKit; react-i18next.',
              'Backend: Go + go-zero + gRPC; MySQL 8 + Redis; etcd; go-ethereum.',
              'Contracts: Hardhat + Solidity 0.8.19+; OpenZeppelin; Slither / Mythril; upgrade & Gnosis Safe planned.',
              'Payments: Arc Testnet — PaymentRouter / SettlementVault; multi-token intents; PaymentPaid ↔ order state machine.',
              'Storage: business DB + IPFS (+ optional cloud).',
            ],
          },
          {
            title: 'Security principles',
            children: [
              'Multi-round audits and automated scanning planned.',
              'Users hold keys; core actions require signatures.',
              'Auditable payment paths; bidirectional order ↔ event reconciliation.',
              'Admin and DApp permission separation; merchant listings feed the storefront after review.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'tokenomics',
    title: '6. Tokenomics',
    blocks: [
      {
        type: 'note',
        text: 'Full parameters and release curves: Tokenomics_Detailed.md. Summary below.',
      },
      {
        type: 'kv',
        items: [
          { label: 'Name', value: 'Sapphire Token (SAP)' },
          { label: 'Standard', value: 'ERC-20' },
          { label: 'Type', value: 'Utility token' },
          { label: 'Total supply', value: '100,000,000 SAP' },
        ],
      },
      {
        type: 'nestedList',
        items: [
          {
            title: 'Roles',
            children: [
              'Governance: credential for DAO proposals and votes.',
              'Incentives: CP mining and rewards for review, arbitration, successful proposals.',
              'Payments: in-platform option with fee discounts when paying in SAP.',
            ],
          },
          {
            title: 'Allocation (planned)',
            children: [
              'Community / ecosystem: 60% (linear unlock via CP mining & campaigns)',
              'Team & advisors: 15% (~2-year vest)',
              'Early investors: 15% (~1-year vest)',
              'Market & liquidity: 10%',
            ],
          },
        ],
      },
      {
        type: 'note',
        text: 'Value capture: a portion of fees may buy back and burn SAP. Example planning target: SAP-paid orders ≥ 25% of total.',
      },
    ],
  },
  {
    id: 'roadmap',
    title: '7. Roadmap',
    blocks: [
      {
        type: 'note',
        text: 'Detailed milestones: Roadmap.md. Engineering status: Development.',
      },
      {
        type: 'nestedList',
        items: [
          {
            title: 'Shipped / in progress (repo-aligned)',
            children: [
              'Website, DApp, admin skeletons with zh/en i18n.',
              'Marketplace browse/checkout path; Arc multi-stablecoin payment intent design.',
              'DAO proposals / discussions / events UI; /rewards aggregation.',
              'Admin ops for goods, orders, users feeding the DApp.',
            ],
          },
          {
            title: 'V1.0 (MVP): Core trading & community review',
            children: [
              'Create, list, browse, and buy virtual goods (incl. NFT forms).',
              'Community listing review; base DAO parameter proposals.',
              'CP recording v1; harden stablecoin + SAP dual-rail payments.',
            ],
          },
          {
            title: 'V2.0: Governance & creator economy',
            children: [
              'Decentralized arbitration; CP mining.',
              'Creator profiles & royalties; vote delegation.',
            ],
          },
          {
            title: 'V3.0: Ecosystem & interoperability',
            children: [
              'Broader multi-chain assets & cross-domain interop; API / SDK.',
              'Asset composability; DAO-funded ecosystem treasury.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'team',
    title: '8. Team & Advisors',
    blocks: [
      {
        type: 'paragraph',
        text: 'The core team brings product, engineering, and design experience from technology and blockchain — covering DApp, microservices, contracts, community ops, and tokenomics. An aligned, execution-focused team is the foundation for long-term delivery. Member and advisor lists will be updated on the website and community channels as the project progresses.',
      },
    ],
  },
  {
    id: 'governance',
    title: '9. Community & Governance',
    blocks: [
      {
        type: 'paragraph',
        text: 'The end state is community autonomy under Sapphire DAO. SAP holders may participate in, among other topics:',
      },
      {
        type: 'list',
        items: [
          'Smart contract upgrades and security-related decisions',
          'Key parameters (fees, contribution algorithms, payment policy)',
          'Treasury usage (buyback, incentives, build)',
          'Ecosystem direction and partnerships',
        ],
      },
      {
        type: 'note',
        text: 'Product surface: /dao for proposals, discussions, and events; on-chain vote progress and outcomes align with SAP holding weight. Channels include forums/Discussions, social networks, and regular online sessions.',
      },
    ],
  },
  {
    id: 'legal',
    title: '10. Legal & Compliance',
    blocks: [
      {
        type: 'paragraph',
        text: 'The project seeks compliant design paths. SAP is intended as a utility token for governance, incentives, and in-platform payments — not a securities offering. Participants should understand applicable law and risks and seek professional advice. This document is not investment advice.',
      },
    ],
  },
  {
    id: 'risk',
    title: '11. Risk Disclosure',
    blocks: [
      {
        type: 'paragraph',
        text: 'Risks include, without limitation: technical (contract bugs, client/backend failures, cross-chain/settlement faults); market (price volatility, liquidity, stablecoin depeg); operational & compliance (policy, licensing, third-party outages); governance (low turnout, conflicts, malicious proposals). Always DYOR and only risk what you can afford to lose.',
      },
    ],
  },
  {
    id: 'contact',
    title: '12. Contact & References',
    blocks: [
      {
        type: 'list',
        items: [
          'Website: https://sapmall.xyz',
          'DApp: https://dapp.sapmall.xyz',
          'GitHub: https://github.com/mingdw/sapmall',
          'Issues: https://github.com/mingdw/sapmall/issues',
          'Community: Discord (see repo README)',
          'Twitter / X: https://x.com/MingDw_1992',
        ],
      },
      {
        type: 'note',
        text: 'Further reading: README.md, PRD.md, Tokenomics_Detailed.md, Roadmap.md, User_Story_Map.md, Metrics_Framework.md. Document version v0.5.0 — aligned with README product narrative; updated with implementation.',
      },
    ],
  },
];

export function getWhitepaperSections(lang: string): WhitepaperSection[] {
  return lang.startsWith('zh') ? zh : en;
}

/** 侧栏目录短标题（树形展示用） */
export function getWhitepaperTocLabel(section: WhitepaperSection, lang: string): string {
  if (!lang.startsWith('zh')) {
    return section.title.replace(/^\d+\.\s*/, (m) => m);
  }
  // 中文侧栏显示「序号 + 中文主标题」，去掉英文括号说明
  return section.title.replace(/\s*\([^)]*\)\s*$/, '');
}
