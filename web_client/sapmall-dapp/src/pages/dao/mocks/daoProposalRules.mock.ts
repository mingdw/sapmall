export type DaoProposalRuleIcon = 'submit' | 'window' | 'quorum' | 'vote' | 'execute';

export type DaoProposalRuleItem = {
  id: string;
  icon: DaoProposalRuleIcon;
  titleKey: string;
  descKey: string;
};

/** 提案 Tab 右侧「提案规则」条目（演示文案，正式参数以链上治理合约为准） */
export const DAO_PROPOSAL_RULES: DaoProposalRuleItem[] = [
  {
    id: 'submit',
    icon: 'submit',
    titleKey: 'dao.proposalRules.items.submit.title',
    descKey: 'dao.proposalRules.items.submit.desc',
  },
  {
    id: 'window',
    icon: 'window',
    titleKey: 'dao.proposalRules.items.window.title',
    descKey: 'dao.proposalRules.items.window.desc',
  },
  {
    id: 'quorum',
    icon: 'quorum',
    titleKey: 'dao.proposalRules.items.quorum.title',
    descKey: 'dao.proposalRules.items.quorum.desc',
  },
  {
    id: 'vote',
    icon: 'vote',
    titleKey: 'dao.proposalRules.items.vote.title',
    descKey: 'dao.proposalRules.items.vote.desc',
  },
  {
    id: 'execute',
    icon: 'execute',
    titleKey: 'dao.proposalRules.items.execute.title',
    descKey: 'dao.proposalRules.items.execute.desc',
  },
];
