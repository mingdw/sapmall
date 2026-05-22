import type { TFunction } from 'i18next';

/** 根据用户输入选择演示回复（后续可接真实客服 API） */
export const pickLiveChatAgentReply = (userText: string, t: TFunction): string => {
  const q = userText.toLowerCase();

  if (/钱包|wallet|连接|connect|签名|sign|助记词|seed/.test(q)) {
    return t('help.liveChat.replies.wallet');
  }
  if (/订单|order|支付|payment|退款|refund|发货|delivery/.test(q)) {
    return t('help.liveChat.replies.order');
  }
  if (/sap|兑换|swap|exchange|gas|滑点|slippage/.test(q)) {
    return t('help.liveChat.replies.exchange');
  }
  if (/商家|merchant|保证金|deposit|入驻/.test(q)) {
    return t('help.liveChat.replies.merchant');
  }
  if (/dao|投票|vote|提案|proposal|社区|community/.test(q)) {
    return t('help.liveChat.replies.dao');
  }
  if (/人工|human|客服|support|help/.test(q)) {
    return t('help.liveChat.replies.human');
  }

  return t('help.liveChat.replies.default');
};
