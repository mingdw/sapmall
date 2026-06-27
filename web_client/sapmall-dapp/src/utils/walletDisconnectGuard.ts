/** 用户主动断开钱包期间，阻止 wagmi 自动重连 / 链同步探测 */
let userDisconnecting = false;

export function beginUserWalletDisconnect(): void {
  userDisconnecting = true;
}

export function endUserWalletDisconnect(): void {
  userDisconnecting = false;
}

export function isUserWalletDisconnecting(): boolean {
  return userDisconnecting;
}
