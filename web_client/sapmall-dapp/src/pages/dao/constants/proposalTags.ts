/** 提案标签 i18n key（与列表 Tag 一致） */
export const DAO_PROPOSAL_TAG_KEYS = [
  'dao.list.proposals.tags.governance',
  'dao.list.proposals.tags.treasury',
  'dao.list.proposals.tags.marketplace',
  'dao.list.proposals.tags.staking',
  'dao.list.proposals.tags.grant',
  'dao.list.proposals.tags.multisig',
  'dao.list.proposals.tags.security',
] as const;

export type DaoProposalTagKey = (typeof DAO_PROPOSAL_TAG_KEYS)[number];
