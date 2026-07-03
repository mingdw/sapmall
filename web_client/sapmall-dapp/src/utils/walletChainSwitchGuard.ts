/** 用户通过导航栏主动切链期间，阻止 WagmiChainMismatchRecovery 把链切回钱包旧网络 */
let userChainSwitching = false;

export function beginUserWalletChainSwitch(): void {
  userChainSwitching = true;
}

export function endUserWalletChainSwitch(): void {
  userChainSwitching = false;
}

export function isUserWalletChainSwitching(): boolean {
  return userChainSwitching;
}
