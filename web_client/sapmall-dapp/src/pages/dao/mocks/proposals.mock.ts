import { Comment, DaoStats, MyGovernanceSnapshot, Proposal } from '../types/proposal.types';

const now = Date.now();
const day = 86400000;

export const MOCK_DAO_STATS: DaoStats = {
  memberCount: 12847,
  activeProposals: 3,
  participationRate30d: 42.6,
  treasuryBalance: '2,450,000 SAP',
};

export const MOCK_MY_GOVERNANCE: MyGovernanceSnapshot = {
  votingPower: 12500,
  pendingVotes: 2,
  votedCount: 14,
  delegateTo: undefined,
};

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'sap-001',
    number: 'SAP-001',
    title: '调整 SAP 质押奖励系数至 8%',
    summary: '将主网质押年化奖励从 6% 上调至 8%，以提升长期持有者参与治理的积极性。',
    bodyMarkdown: `## 背景\n\n当前 SAP 质押年化约 6%，低于同类 Web3 商城生态均值。\n\n## 提案内容\n\n- 将 **stakingRewardRate** 从 \`600\` (bps) 调整为 \`800\`\n- 生效区块：通过后 7 天\n\n## 风险\n\n短期通胀压力略增，需配合金库支出审查。`,
    impact: '通过后，质押合约将在 Timelock 结束后自动更新奖励参数；用户无需手动操作。',
    status: 'active',
    type: 'parameter',
    proposerAddress: '0x7a3f...9c2e',
    proposerDisplay: 'saplabs.eth',
    timeline: {
      createdAt: new Date(now - 12 * day).toISOString(),
      discussionEndsAt: new Date(now - 5 * day).toISOString(),
      votingStartsAt: new Date(now - 5 * day).toISOString(),
      votingEndsAt: new Date(now + 2 * day).toISOString(),
    },
    tally: {
      for: 8420000,
      against: 2100000,
      abstain: 380000,
      quorumPercent: 68,
      quorumRequired: 60,
      participationPercent: 54.2,
    },
    voteRecords: [
      { id: 'v1', voterAddress: '0x12A9...3cF8', option: 'for', weight: 50000, votedAt: new Date(now - 4 * day).toISOString() },
      { id: 'v2', voterAddress: '0x9B3e...A71d', option: 'against', weight: 12000, delegatedFrom: '0x4d77...8E2a', votedAt: new Date(now - 3 * day).toISOString(), txHash: '0xabc123' },
    ],
    comments: [
      { id: 'c1', authorAddress: '0x12A9...3cF8', authorDisplay: 'holder_alpha', content: '支持上调，能留住长期质押者。', createdAt: new Date(now - 10 * day).toISOString(), likes: 24, replies: [
        { id: 'c1r1', authorAddress: '0x9B3e...A71d', authorDisplay: 'dao_skeptic', content: '需同步公布金库支出上限。', createdAt: new Date(now - 9 * day).toISOString(), likes: 8 },
      ]},
      { id: 'c2', authorAddress: '0x4d77...8E2a', authorDisplay: 'treasury_watch', content: '建议分阶段上调，先 7% 观察一季。', createdAt: new Date(now - 8 * day).toISOString(), likes: 31 },
    ],
    onChain: { chainId: 1, governorAddress: '0xGovernor...Sap', proposalId: '42' },
    tags: ['staking', 'economics'],
  },
  {
    id: 'sap-002',
    number: 'SAP-002',
    title: '社区金库拨款 50 万 SAP 支持创作者激励计划',
    summary: '为 Q2 虚拟商品创作者设立激励池，按贡献度分配，由多签委员会执行拨付。',
    bodyMarkdown: `## 用途\n\n- 50% 新入驻商家补贴\n- 30% 优质 UGC 内容奖励\n- 20% 线下/Web3 联名活动\n\n## 治理\n\n拨付需经多签 3/5 确认，月度公开报表。`,
    impact: '金库将转出 500,000 SAP 至激励多签地址；不影响质押参数。',
    status: 'discussion',
    type: 'treasury',
    proposerAddress: '0xE812...6a44',
    proposerDisplay: 'creator_council',
    timeline: {
      createdAt: new Date(now - 3 * day).toISOString(),
      discussionEndsAt: new Date(now + 4 * day).toISOString(),
      votingStartsAt: new Date(now + 4 * day).toISOString(),
      votingEndsAt: new Date(now + 11 * day).toISOString(),
    },
    tally: { for: 0, against: 0, abstain: 0, quorumPercent: 0, quorumRequired: 60, participationPercent: 0 },
    voteRecords: [],
    comments: [
      { id: 'c3', authorAddress: '0x73f1...D0E9', authorDisplay: 'merchant_01', content: '补贴门槛需要写进细则。', createdAt: new Date(now - 2 * day).toISOString(), likes: 15 },
      { id: 'c4', authorAddress: '0xAA90...1b5C', authorDisplay: 'nft_artist', content: '强烈支持，希望有透明 dashboard。', createdAt: new Date(now - 1 * day).toISOString(), likes: 42 },
    ],
    isHotDiscussion: true,
    tags: ['treasury', 'creators'],
  },
  {
    id: 'sap-003',
    number: 'SAP-003',
    title: '启用链上商品类目治理模块（MVP）',
    summary: '允许持票权 ≥10k SAP 的地址发起新类目上架投票，与商城后台类目树同步。',
    bodyMarkdown: '技术方案见附件 RFC-12。',
    impact: '商城将开放类目治理入口；未通过类目保持只读。',
    status: 'passed',
    type: 'protocol',
    proposerAddress: '0x4d77...8E2a',
    proposerDisplay: 'protocol_team',
    timeline: {
      createdAt: new Date(now - 20 * day).toISOString(),
      votingEndsAt: new Date(now - 5 * day).toISOString(),
      executedAt: undefined,
    },
    tally: {
      for: 12000000,
      against: 1800000,
      abstain: 600000,
      quorumPercent: 82,
      quorumRequired: 60,
      participationPercent: 61.3,
    },
    voteRecords: [
      { id: 'v3', voterAddress: '0x12A9...3cF8', option: 'for', weight: 50000, votedAt: new Date(now - 8 * day).toISOString(), txHash: '0xdef456' },
    ],
    comments: [],
    execution: { status: 'timelock', timelockEndsAt: new Date(now + 1 * day).toISOString() },
    tags: ['marketplace', 'protocol'],
  },
  {
    id: 'sap-004',
    number: 'SAP-004',
    title: '降低治理投票 Quorum 至 50%',
    summary: '近期参与率下滑，拟将法定 quorum 从 60% 降至 50%。',
    bodyMarkdown: '争议较大，详见讨论区。',
    impact: '未来提案通过门槛降低，可能加快执行但也降低代表性。',
    status: 'rejected',
    type: 'parameter',
    proposerAddress: '0x9B3e...A71d',
    proposerDisplay: 'reform_group',
    timeline: {
      createdAt: new Date(now - 25 * day).toISOString(),
      votingEndsAt: new Date(now - 10 * day).toISOString(),
    },
    tally: {
      for: 3200000,
      against: 9800000,
      abstain: 400000,
      quorumPercent: 55,
      quorumRequired: 60,
      participationPercent: 48.1,
    },
    voteRecords: [],
    comments: [
      { id: 'c5', authorAddress: '0x7a3f...9c2e', authorDisplay: 'saplabs.eth', content: '反对降低 quorum，治理不应为效率牺牲安全。', createdAt: new Date(now - 18 * day).toISOString(), likes: 56 },
    ],
    tags: ['governance'],
  },
  {
    id: 'sap-005',
    number: 'SAP-005',
    title: '多语言商城文案贡献者赏金计划',
    summary: '为 i18n 贡献设立链下赏金 + 季度 SAP 空投，细则由社区委员会拟定。',
    bodyMarkdown: '讨论稿阶段，投票尚未开启。',
    impact: '仅影响社区运营预算方向，无链上自动执行。',
    status: 'discussion',
    type: 'community',
    proposerAddress: '0x73f1...D0E9',
    proposerDisplay: 'i18n_guild',
    timeline: {
      createdAt: new Date(now - 1 * day).toISOString(),
      discussionEndsAt: new Date(now + 6 * day).toISOString(),
    },
    tally: { for: 0, against: 0, abstain: 0, quorumPercent: 0, quorumRequired: 60, participationPercent: 0 },
    voteRecords: [],
    comments: [
      { id: 'c6', authorAddress: '0xAA90...1b5C', authorDisplay: 'translator_ko', content: '希望明确审核标准与结算周期。', createdAt: new Date(now - 12 * 3600000).toISOString(), likes: 9 },
    ],
    isHotDiscussion: true,
    tags: ['community', 'i18n'],
  },
  {
    id: 'sap-006',
    number: 'SAP-006',
    title: '集成 Snapshot 签名校验（只读）',
    summary: '在 DApp 治理页展示 Snapshot 投票结果只读镜像，链上投票仍以 Sapmall Governor 为准。',
    bodyMarkdown: '已完成开发与审计，等待执行。',
    impact: '用户可在同一详情页看到链下签名票与链上票对照。',
    status: 'executed',
    type: 'protocol',
    proposerAddress: '0x4d77...8E2a',
    proposerDisplay: 'protocol_team',
    timeline: {
      createdAt: new Date(now - 45 * day).toISOString(),
      votingEndsAt: new Date(now - 30 * day).toISOString(),
      executedAt: new Date(now - 25 * day).toISOString(),
    },
    tally: {
      for: 15000000,
      against: 500000,
      abstain: 200000,
      quorumPercent: 91,
      quorumRequired: 60,
      participationPercent: 58.7,
    },
    voteRecords: [],
    comments: [],
    execution: { status: 'executed', txHash: '0x9876543210abcdef' },
    tags: ['integration'],
  },
  {
    id: 'sap-007',
    number: 'SAP-007',
    title: '【草稿】NFT 持有者专属治理权重试点',
    summary: '内部草稿，尚未发布讨论。',
    bodyMarkdown: '草稿内容…',
    impact: '待定',
    status: 'draft',
    type: 'parameter',
    proposerAddress: '0x7a3f...9c2e',
    proposerDisplay: 'saplabs.eth',
    timeline: { createdAt: new Date(now - 2 * day).toISOString() },
    tally: { for: 0, against: 0, abstain: 0, quorumPercent: 0, quorumRequired: 60, participationPercent: 0 },
    voteRecords: [],
    comments: [],
    tags: ['nft', 'draft'],
  },
  {
    id: 'sap-008',
    number: 'SAP-008',
    title: '紧急暂停跨链桥提现 72 小时',
    summary: '安全团队发现可疑流量，建议临时暂停桥提现并完成排查。',
    bodyMarkdown: '安全公告 #SEC-2026-03',
    impact: '72 小时内跨链提现暂停；商城主站交易不受影响。',
    status: 'active',
    type: 'protocol',
    proposerAddress: '0xSec...Team',
    proposerDisplay: 'security_multisig',
    timeline: {
      createdAt: new Date(now - 1 * day).toISOString(),
      votingStartsAt: new Date(now - 1 * day).toISOString(),
      votingEndsAt: new Date(now + 1 * day).toISOString(),
    },
    tally: {
      for: 6200000,
      against: 5800000,
      abstain: 200000,
      quorumPercent: 72,
      quorumRequired: 60,
      participationPercent: 67.8,
    },
    voteRecords: [],
    comments: [
      { id: 'c7', authorAddress: '0x12A9...3cF8', authorDisplay: 'holder_alpha', content: '支持紧急措施，请每日披露进展。', createdAt: new Date(now - 20 * 3600000).toISOString(), likes: 18 },
    ],
    tags: ['security', 'urgent'],
  },
];

export function getProposalById(id: string): Proposal | undefined {
  return MOCK_PROPOSALS.find((p) => p.id === id);
}

export function getActiveProposals(): Proposal[] {
  return MOCK_PROPOSALS.filter((p) => p.status === 'active');
}

export function getDiscussionProposals(): Proposal[] {
  return MOCK_PROPOSALS.filter((p) => p.status === 'discussion' || p.isHotDiscussion);
}
