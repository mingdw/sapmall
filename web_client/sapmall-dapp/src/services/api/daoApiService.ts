import { Proposal, VoteOption } from '../../pages/dao/types/proposal.types';
import { getProposalById, MOCK_PROPOSALS } from '../../pages/dao/mocks/proposals.mock';

/** DAO 治理 API — MVP 使用 mock，链上对接后替换实现 */
export const daoApiService = {
  async listProposals(): Promise<Proposal[]> {
    return Promise.resolve([...MOCK_PROPOSALS]);
  },

  async getProposal(id: string): Promise<Proposal | null> {
    const p = getProposalById(id);
    return Promise.resolve(p ?? null);
  },

  async submitVote(
    _proposalId: string,
    _option: VoteOption,
    _signature?: string
  ): Promise<{ success: boolean; message?: string }> {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true };
  },

  async postComment(
    _proposalId: string,
    _content: string
  ): Promise<{ success: boolean; message?: string }> {
    await new Promise((r) => setTimeout(r, 400));
    return { success: true };
  },
};
