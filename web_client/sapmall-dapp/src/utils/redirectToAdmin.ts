/** 跳转 admin 后台并定位菜单（与 WalletConnect 一致） */
export function redirectToAdmin(menu: string) {
  window.open(`/admin?menu=${menu}`, '_self');
}
