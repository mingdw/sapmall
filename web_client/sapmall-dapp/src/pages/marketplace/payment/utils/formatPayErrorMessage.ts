/** 将钱包 / 链上错误转为用户可读说明 */
export function formatPayErrorMessage(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const m = raw.toLowerCase();

  if (m.includes('router_mismatch') || m.includes('paymentrouter 地址')) {
    return 'PaymentRouter 地址与当前部署不一致，请刷新页面后重新授权并支付';
  }
  if (m.includes('intentalreadypaid') || m.includes('intent already paid')) {
    return '该支付意图已在链上使用，请重新下单后再支付';
  }
  if (m.includes('tokennotsupported')) {
    return '该支付币种尚未加入 PaymentRouter 白名单，需运维执行 addToken 脚本';
  }
  if (
    m.includes('exceeds balance') ||
    m.includes('insufficient funds') ||
    m.includes('transfer amount exceeds') ||
    m.includes('erc20insufficientbalance')
  ) {
    return '支付代币余额不足，或用于 Gas 的 USDC 不足以支付本笔交易';
  }
  if (m.includes('accesscontrol') || m.includes('unauthorizedaccount')) {
    return 'PaymentRouter 未获得 SettlementVault 授权，请联系运维检查 ROUTER_ROLE';
  }
  if (m.includes('enforcedpause') || m.includes('contract paused')) {
    return '支付合约已暂停，请稍后重试';
  }
  if (m.includes('istokensupported') && m.includes('revert')) {
    return 'PaymentRouter 合约地址无效或版本过旧，请确认后台已更新为最新部署地址';
  }
  if (m.includes('user rejected') || m.includes('user denied')) {
    return '您已在钱包中取消操作';
  }

  // 尝试从 revert 文案中提取自定义 error 名
  const customErr = raw.match(
    /(?:reverted with reason|custom error|error name)[:\s]+['"]?([A-Za-z0-9_]+)/i,
  );
  if (customErr?.[1]) {
    const nested = formatPayErrorMessage(customErr[1]);
    if (nested) return nested;
  }

  if (m.includes('链上交易 revert')) {
    return '链上交易已提交但执行失败（revert），请重新下单或联系客服';
  }
  if (m.includes('reverted') || m.includes('execution reverted')) {
    return '链上模拟或交易被拒绝，请检查余额、网络与合约配置';
  }

  const trimmed = raw.trim();
  return trimmed.length > 160 ? `${trimmed.slice(0, 160)}…` : trimmed;
}
