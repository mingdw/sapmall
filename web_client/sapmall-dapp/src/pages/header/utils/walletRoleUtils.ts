import { Shield, Store, ShoppingBag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type WalletRoleCode = 'R0001' | 'R0002' | 'R0003';

export const WALLET_ROLE_ORDER: WalletRoleCode[] = ['R0001', 'R0002', 'R0003'];

export const WALLET_ROLE_I18N_KEY: Record<WalletRoleCode, string> = {
  R0001: 'walletConnect.roles.admin',
  R0002: 'walletConnect.roles.merchant',
  R0003: 'walletConnect.roles.buyer',
};

export const WALLET_ROLE_BADGE_CLASS: Record<WalletRoleCode, string> = {
  R0001: 'roleBadgeAdmin',
  R0002: 'roleBadgeMerchant',
  R0003: 'roleBadgeBuyer',
};

export const WALLET_ROLE_ICON: Record<WalletRoleCode, LucideIcon> = {
  R0001: Shield,
  R0002: Store,
  R0003: ShoppingBag,
};

export function resolveWalletRoleCodes(roles?: string[]): WalletRoleCode[] {
  if (!roles?.length) return ['R0003'];

  const known = roles.filter((role): role is WalletRoleCode =>
    WALLET_ROLE_ORDER.includes(role as WalletRoleCode),
  );

  if (!known.length) return ['R0003'];

  return WALLET_ROLE_ORDER.filter((code) => known.includes(code));
}

export function getPrimaryWalletRoleCode(roles?: string[]): WalletRoleCode {
  return resolveWalletRoleCodes(roles)[0];
}
